import { useEffect, useMemo, useRef, useState } from 'react';

const WS_URL = 'ws://localhost:3000';

const Display = () => {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState({ timer: { running: false, time: 0, duration: 0 }, notes: '' });

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
        }
      } catch (err) {
        console.error('Failed to parse message', err);
      }
    });

    return () => socket.close();
  }, []);

  const formattedTime = useMemo(() => {
    const total = state.timer.time || 0;
    const minutes = Math.floor(total / 60).toString().padStart(2, '0');
    const seconds = Math.floor(total % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [state.timer.time]);

  const timeColor = useMemo(() => {
    const remaining = state.timer.time || 0;
    if (remaining > 300) return '#00FF00';
    if (remaining > 120) return '#FFFF00';
    return '#FF0000';
  }, [state.timer.time]);

  return (
    <div className="screen display-screen">
      <div className="tagline">this was coded at @jsconfmx</div>
      {!connected && <div className="banner warning">⚠️ Connection Lost</div>}
      {!state.timer.running && <div className="banner paused">⏸️ Paused</div>}
      <div className="timer" style={{ color: timeColor }}>
        {formattedTime}
      </div>
      <div className="notes">{state.notes || '—'}</div>
    </div>
  );
};

export default Display;
