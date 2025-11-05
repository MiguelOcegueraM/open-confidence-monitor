import { useEffect, useMemo, useRef, useState } from 'react';

const WS_URL = 'ws://localhost:3000';

const Control = () => {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState({ timer: { running: false, time: 0, duration: 0 }, notes: '' });
  const [minutesInput, setMinutesInput] = useState('');

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    wsRef.current = socket;

    socket.addEventListener('open', () => setConnected(true));
    socket.addEventListener('close', () => setConnected(false));
    socket.addEventListener('message', event => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'state') {
          setState(data.value);
          setMinutesInput(prev => (prev === '' ? Math.floor(data.value.timer.duration / 60) || '' : prev));
        }
      } catch (err) {
        console.error('Failed to parse message', err);
      }
    });

    return () => socket.close();
  }, []);

  const send = payload => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  };

  const formattedTime = useMemo(() => {
    const total = state.timer.time || 0;
    const minutes = Math.floor(total / 60).toString().padStart(2, '0');
    const seconds = Math.floor(total % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [state.timer.time]);

  const handleSetTimer = () => {
    const minutes = Number(minutesInput);
    if (!Number.isNaN(minutes) && minutes >= 0) {
      send({ type: 'setTimer', value: Math.round(minutes * 60) });
    }
  };

  return (
    <div className="screen control-screen">
      <header className="control-header">
        <h1>JSConfMX Confidence Monitor</h1>
        <span className={`status ${connected ? 'online' : 'offline'}`}>
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </header>

      <section className="timer-section">
        <div className="timer-display">{formattedTime}</div>
        <div className="duration">
          Duration: {Math.floor(state.timer.duration / 60) || 0} min
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
          value={state.notes}
          placeholder="Type speaker notes here…"
          onChange={e => send({ type: 'updateNotes', value: e.target.value })}
        />
      </section>
    </div>
  );
};

export default Control;
