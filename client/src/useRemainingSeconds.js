import { useEffect, useState } from 'react';

const remainingMs = (timer, clockOffset) =>
  timer.running ? timer.endsAt - (Date.now() + clockOffset) : timer.remaining;

// Whole seconds left, rounded up so a 10:00 timer shows 10:00 when it starts.
// Goes negative once the timer runs over.
const toSeconds = ms => Math.ceil(ms / 1000) || 0;

// Ticks locally from the server's endsAt, so the display stays smooth on a laggy
// network and keeps counting through short disconnects.
const useRemainingSeconds = (timer, clockOffset) => {
  const [seconds, setSeconds] = useState(() => toSeconds(remainingMs(timer, clockOffset)));

  useEffect(() => {
    setSeconds(toSeconds(remainingMs(timer, clockOffset)));
    if (!timer.running) return undefined;

    let frame;
    const tick = () => {
      setSeconds(toSeconds(remainingMs(timer, clockOffset)));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [timer, clockOffset]);

  return seconds;
};

export const formatSeconds = total => {
  const sign = total < 0 ? '-' : '';
  const abs = Math.abs(total);
  const minutes = Math.floor(abs / 60).toString().padStart(2, '0');
  const seconds = Math.floor(abs % 60).toString().padStart(2, '0');
  return `${sign}${minutes}:${seconds}`;
};

export default useRemainingSeconds;
