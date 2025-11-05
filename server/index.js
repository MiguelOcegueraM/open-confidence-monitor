const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const TICK_MS = 1000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const state = {
  timer: { running: false, time: 0, duration: 0 },
  notes: ''
};

const broadcastState = () => {
  const payload = JSON.stringify({ type: 'state', value: state });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};

const setTimer = seconds => {
  state.timer.duration = Math.max(0, seconds);
  state.timer.time = state.timer.duration;
  state.timer.running = false;
  broadcastState();
};

const startTimer = () => {
  if (state.timer.time > 0) {
    state.timer.running = true;
    broadcastState();
  }
};

const pauseTimer = () => {
  if (state.timer.running) {
    state.timer.running = false;
    broadcastState();
  }
};

const resetTimer = () => {
  state.timer.time = state.timer.duration;
  state.timer.running = false;
  broadcastState();
};

const timerTick = () => {
  if (state.timer.running && state.timer.time > 0) {
    state.timer.time -= 1;
    if (state.timer.time <= 0) {
      state.timer.time = 0;
      state.timer.running = false;
    }
    broadcastState();
  }
};

setInterval(timerTick, TICK_MS);

wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'state', value: state }));

  ws.on('message', message => {
    try {
      const { type, value } = JSON.parse(message);
      switch (type) {
        case 'updateNotes':
          state.notes = typeof value === 'string' ? value : '';
          broadcastState();
          break;
        case 'setTimer':
          setTimer(Number(value) || 0);
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

server.listen(PORT, () => {
  console.log(`Confidence monitor server listening on http://localhost:${PORT}`);
});
