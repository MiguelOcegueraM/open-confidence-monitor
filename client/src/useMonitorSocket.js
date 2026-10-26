import { useCallback, useEffect, useRef, useState } from 'react';

const WS_PORT = import.meta.env.VITE_WS_PORT || 3000;
const WS_URL =
  import.meta.env.VITE_WS_URL ||
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:${WS_PORT}`;

const INITIAL_BACKOFF_MS = 500;
const MAX_BACKOFF_MS = 5000;
// The server pings every 5s; if nothing arrives for this long the connection is dead.
const STALE_AFTER_MS = 12000;

const initialState = {
  timer: { running: false, duration: 0, remaining: 0, endsAt: null },
  notes: ''
};

const useMonitorSocket = ({ token } = {}) => {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [authorized, setAuthorized] = useState(null);
  const [state, setState] = useState(initialState);
  // serverNow - Date.now(), so clients with skewed clocks still agree on endsAt.
  const [clockOffset, setClockOffset] = useState(0);

  useEffect(() => {
    let disposed = false;
    let backoff = INITIAL_BACKOFF_MS;
    let reconnectTimer;
    let staleTimer;

    const connect = () => {
      const url = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;
      const socket = new WebSocket(url);
      wsRef.current = socket;

      const markAlive = () => {
        clearTimeout(staleTimer);
        staleTimer = setTimeout(() => socket.close(), STALE_AFTER_MS);
      };

      socket.addEventListener('open', () => {
        backoff = INITIAL_BACKOFF_MS;
        setConnected(true);
        markAlive();
      });

      socket.addEventListener('close', () => {
        clearTimeout(staleTimer);
        setConnected(false);
        if (disposed) return;
        reconnectTimer = setTimeout(connect, backoff);
        backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
      });

      socket.addEventListener('message', event => {
        markAlive();
        try {
          const data = JSON.parse(event.data);
          if (typeof data.serverNow === 'number') {
            setClockOffset(data.serverNow - Date.now());
          }
          if (data.type === 'state') {
            setState(data.value);
          } else if (data.type === 'auth') {
            setAuthorized(data.value);
          }
        } catch (err) {
          console.error('Failed to parse message', err);
        }
      });
    };

    connect();

    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      clearTimeout(staleTimer);
      wsRef.current?.close();
    };
  }, [token]);

  const send = useCallback(payload => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  return { connected, authorized, state, clockOffset, send };
};

export default useMonitorSocket;
