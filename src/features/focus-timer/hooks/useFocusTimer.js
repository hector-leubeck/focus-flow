import { useEffect, useState } from "react";
import { useFocusTimerStore } from "../store/focusTimerStore";
import { getRemainingSeconds } from "../timerUtils";

function useFocusTimer() {
  const status = useFocusTimerStore((state) => state.status);
  const durationSeconds = useFocusTimerStore((state) => state.durationSeconds);
  const elapsedSeconds = useFocusTimerStore((state) => state.elapsedSeconds);
  const startedAt = useFocusTimerStore((state) => state.startedAt);
  const sessions = useFocusTimerStore((state) => state.sessions);
  const start = useFocusTimerStore((state) => state.start);
  const pause = useFocusTimerStore((state) => state.pause);
  const resume = useFocusTimerStore((state) => state.resume);
  const reset = useFocusTimerStore((state) => state.reset);
  const complete = useFocusTimerStore((state) => state.complete);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (status !== "running") {
      return undefined;
    }

    function updateClock() {
      const currentTime = Date.now();
      const remaining = getRemainingSeconds(
        { status, durationSeconds, elapsedSeconds, startedAt },
        currentTime,
      );

      setNow(currentTime);

      if (remaining === 0) {
        complete(currentTime);
      }
    }

    updateClock();
    const intervalId = setInterval(updateClock, 250);
    document.addEventListener("visibilitychange", updateClock);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", updateClock);
    };
  }, [complete, durationSeconds, elapsedSeconds, startedAt, status]);

  const remainingSeconds = getRemainingSeconds(
    { status, durationSeconds, elapsedSeconds, startedAt },
    now,
  );

  return {
    status,
    durationSeconds,
    elapsedSeconds,
    remainingSeconds,
    sessions,
    start,
    pause,
    resume,
    reset,
    complete,
  };
}

export default useFocusTimer;
