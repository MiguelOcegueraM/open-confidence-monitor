import { useEffect, useState } from 'react';
import useMonitorSocket from '../useMonitorSocket.js';
import useRemainingSeconds, { formatSeconds } from '../useRemainingSeconds.js';

const TOKEN_KEY = 'controlToken';

const readInitialToken = () => {
  const fromUrl = new URLSearchParams(window.location.search).get('token');
  try {
    if (fromUrl) localStorage.setItem(TOKEN_KEY, fromUrl);
    return fromUrl || localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return fromUrl || '';
  }
};

const Control = () => {
  const [token, setToken] = useState(readInitialToken);
  const [tokenInput, setTokenInput] = useState('');
  const { connected, authorized, state, clockOffset, send } = useMonitorSocket({ token });
  const remaining = useRemainingSeconds(state.timer, clockOffset);
  const [minutesInput, setMinutesInput] = useState('');
  const [notesDraft, setNotesDraft] = useState(null);

  useEffect(() => {
    setMinutesInput(prev => (prev === '' ? Math.floor(state.timer.duration / 60000) || '' : prev));
  }, [state.timer.duration]);

  // Notes are edited locally and only pushed on send, so the speaker never sees half-typed text.
  const draft = notesDraft ?? state.notes;
  const hasUnsentNotes = notesDraft !== null && notesDraft !== state.notes;

  const handleSetTimer = () => {
    const minutes = Number(minutesInput);
    if (!Number.isNaN(minutes) && minutes >= 0) {
      send({ type: 'setTimer', value: Math.round(minutes * 60) });
    }
  };

  const handleSendNotes = () => {
    send({ type: 'updateNotes', value: draft });
    setNotesDraft(null);
  };

  const handleNotesKeyDown = e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSendNotes();
    }
  };

  const handleTokenSubmit = e => {
    e.preventDefault();
    const value = tokenInput.trim();
    try {
      localStorage.setItem(TOKEN_KEY, value);
    } catch {
      // Storage can be unavailable (private mode); the token still works for this session.
    }
    setToken(value);
    setTokenInput('');
  };

  if (connected && authorized === false) {
    return (
      <div className="screen control-screen">
        <header className="control-header">
          <h1>JSConfMX Confidence Monitor</h1>
        </header>
        <form className="controls" onSubmit={handleTokenSubmit}>
          <label>
            Control token
            <input
              type="password"
              autoFocus
              value={tokenInput}
              placeholder="Printed in the server console"
              onChange={e => setTokenInput(e.target.value)}
            />
          </label>
          <div className="buttons">
            <button type="submit">Unlock</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="screen control-screen">
      <header className="control-header">
        <h1>JSConfMX Confidence Monitor</h1>
        <span className={`status ${connected ? 'online' : 'offline'}`}>
          {connected ? '🟢 Connected' : '🔴 Reconnecting…'}
        </span>
      </header>

      <section className="timer-section">
        <div className="timer-display">{formatSeconds(remaining)}</div>
        <div className="duration">
          Duration: {Math.floor(state.timer.duration / 60000) || 0} min
        </div>

        <div className="controls">
          <label>
            Minutes
            <input
              type="number"
              min="0"
              value={minutesInput}
              onChange={e => setMinutesInput(e.target.value)}
            />
          </label>
          <div className="buttons">
            <button onClick={handleSetTimer}>Set Timer</button>
            <button onClick={() => send({ type: 'startTimer' })}>Start</button>
            <button onClick={() => send({ type: 'pauseTimer' })}>Pause</button>
            <button onClick={() => send({ type: 'resetTimer' })}>Reset</button>
          </div>
        </div>
      </section>

      <section className="notes-section">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={draft}
          placeholder="Type speaker notes here…"
          onChange={e => setNotesDraft(e.target.value)}
          onKeyDown={handleNotesKeyDown}
        />
        <div className="notes-actions">
          <span className="notes-hint">
            {hasUnsentNotes ? 'Unsent changes · ⌘/Ctrl + Enter to send' : 'Speaker is seeing these notes'}
          </span>
          <div className="buttons">
            <button onClick={handleSendNotes} disabled={!hasUnsentNotes}>
              Send to display
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Control;
