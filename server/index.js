const crypto = require('crypto');
const os = require('os');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const HEARTBEAT_MS = 5000;
// Without CONTROL_TOKEN a random one is generated per run, so /control is never open by default.
const CONTROL_TOKEN = process.env.CONTROL_TOKEN || crypto.randomBytes(4).toString('hex');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// All times are in milliseconds. While running, `endsAt` is the source of truth and
// clients compute the remaining time locally; while paused, `remaining` is.
// `remaining` can go negative once the speaker runs over time.
const state = {
  timer: { running: false, duration: 0, remaining: 0, endsAt: null },
  notes: ''
};

const send = (ws, payload) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ ...payload, serverNow: Date.now() }));
  }
};

const broadcastState = () => {
  wss.clients.forEach(client => send(client, { type: 'state', value: state }));
};

const isValidToken = token => {
  if (typeof token !== 'string') return false;
  const expected = Buffer.from(CONTROL_TOKEN);
  const received = Buffer.from(token);
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};

const setTimer = ms => {
  state.timer.duration = Math.max(0, ms);
  state.timer.remaining = state.timer.duration;
  state.timer.endsAt = null;
  state.timer.running = false;
  broadcastState();
};

const startTimer = () => {
  if (!state.timer.running && state.timer.duration > 0) {
    state.timer.endsAt = Date.now() + state.timer.remaining;
    state.timer.running = true;
    broadcastState();
  }
};

const pauseTimer = () => {
  if (state.timer.running) {
    state.timer.remaining = state.timer.endsAt - Date.now();
    state.timer.endsAt = null;
    state.timer.running = false;
    broadcastState();
  }
};

const resetTimer = () => {
  state.timer.remaining = state.timer.duration;
  state.timer.endsAt = null;
  state.timer.running = false;
  broadcastState();
};

// App-level heartbeat: browsers can't observe ws pings, so clients use this to detect
// silent drops (e.g. venue WiFi) and to keep their clock offset fresh.
setInterval(() => {
  wss.clients.forEach(client => send(client, { type: 'ping' }));
}, HEARTBEAT_MS);

wss.on('connection', (ws, req) => {
  const token = new URL(req.url, 'http://localhost').searchParams.get('token');
  const isControl = isValidToken(token);

  send(ws, { type: 'auth', value: isControl });
  send(ws, { type: 'state', value: state });

  ws.on('message', message => {
    try {
      const { type, value } = JSON.parse(message);
      if (!isControl) {
        send(ws, { type: 'auth', value: false });
        return;
      }
      switch (type) {
        case 'updateNotes':
          state.notes = typeof value === 'string' ? value : '';
          broadcastState();
          break;
        case 'setTimer':
          setTimer((Number(value) || 0) * 1000);
          break;
        case 'startTimer':
          startTimer();
          break;
        case 'pauseTimer':
          pauseTimer();
          break;
        case 'resetTimer':
          resetTimer();
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Invalid message received:', err);
    }
  });
});

const lanAddresses = () =>
  Object.values(os.networkInterfaces())
    .flat()
    .filter(iface => iface && iface.family === 'IPv4' && !iface.internal)
    .map(iface => iface.address);

server.listen(PORT, () => {
  console.log(`Confidence monitor server listening on http://localhost:${PORT}`);
  console.log(`Control token: ${CONTROL_TOKEN}`);
  ['localhost', ...lanAddresses()].forEach(host => {
    console.log(`  Control: http://${host}:5173/control?token=${CONTROL_TOKEN}`);
    console.log(`  Display: http://${host}:5173/display`);
  });
});
