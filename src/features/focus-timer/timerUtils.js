export function getElapsedSeconds(timer, now) {
  if (timer.status !== "running" || timer.startedAt === null) {
    return timer.elapsedSeconds;
  }

  const runningSeconds = Math.max(
    0,
    Math.floor((now - timer.startedAt) / 1000),
  );

  return Math.min(timer.durationSeconds, timer.elapsedSeconds + runningSeconds);
}

export function getRemainingSeconds(timer, now) {
  return Math.max(0, timer.durationSeconds - getElapsedSeconds(timer, now));
}

export function formatTimerTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}
