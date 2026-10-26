import { useMemo } from 'react';
import useMonitorSocket from '../useMonitorSocket.js';
import useRemainingSeconds, { formatSeconds } from '../useRemainingSeconds.js';

const Display = () => {
  const { connected, state, clockOffset } = useMonitorSocket();
  const remaining = useRemainingSeconds(state.timer, clockOffset);

  const timeColor = useMemo(() => {
    if (remaining > 300) return '#00FF00';
    if (remaining > 120) return '#FFFF00';
    return '#FF0000';
  }, [remaining]);

  return (
    <div className="screen display-screen">
      <div className="tagline">this was coded at @jsconfmx</div>
      {!connected && <div className="banner warning">⚠️ Connection Lost</div>}
      {!state.timer.running && <div className="banner paused">⏸️ Paused</div>}
      <div className="timer" style={{ color: timeColor }}>
        {formatSeconds(remaining)}
      </div>
      <div className="notes">{state.notes || '—'}</div>
    </div>
  );
};

export default Display;
