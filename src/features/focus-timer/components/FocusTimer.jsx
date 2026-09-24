import { CheckCircle2, Clock3, Pause, Play, RotateCcw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import useFocusTimer from "../hooks/useFocusTimer";
import { TIMER_STATUSES } from "../timerConfig";
import { formatTimerTime } from "../timerUtils";
import "./FocusTimer.css";

const statusLabels = {
  [TIMER_STATUSES.IDLE]: "Ready to focus",
  [TIMER_STATUSES.RUNNING]: "Focus in progress",
  [TIMER_STATUSES.PAUSED]: "Focus paused",
  [TIMER_STATUSES.COMPLETED]: "Session complete",
};

function FocusTimer() {
  const reduceMotion = useReducedMotion();
  const {
    complete,
    durationSeconds,
    elapsedSeconds,
    pause,
    remainingSeconds,
    reset,
    resume,
    sessions,
    start,
    status,
  } = useFocusTimer();

  const isRunning = status === TIMER_STATUSES.RUNNING;
  const isPaused = status === TIMER_STATUSES.PAUSED;
  const isCompleted = status === TIMER_STATUSES.COMPLETED;

  return (
    <Card
      as="section"
      className="focus-timer-card"
      id="focus-timer"
      aria-labelledby="focus-timer-title"
    >
      <div className="focus-timer-heading">
        <div className="focus-timer-icon" aria-hidden="true">
          <Clock3 size={21} />
        </div>
        <div>
          <p className="placeholder-label">02 / Focus</p>
          <h2 id="focus-timer-title">Focus timer</h2>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className={`focus-timer-display is-${status}`}
          aria-live="polite"
          key={status}
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
        >
          <span className="focus-timer-status">{statusLabels[status]}</span>
          <strong>{formatTimerTime(remainingSeconds)}</strong>
          <span className="focus-timer-caption">
            {Math.floor(durationSeconds / 60)} minute session
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="focus-timer-actions">
        {status === TIMER_STATUSES.IDLE ? (
          <Button onClick={() => start()}>
            <Play size={15} fill="currentColor" />
            Start focus
          </Button>
        ) : null}
        {isRunning ? (
          <Button variant="secondary" onClick={() => pause()}>
            <Pause size={15} fill="currentColor" />
            Pause
          </Button>
        ) : null}
        {isPaused ? (
          <Button onClick={() => resume()}>
            <Play size={15} fill="currentColor" />
            Resume
          </Button>
        ) : null}
        {isRunning || isPaused ? (
          <Button variant="secondary" onClick={() => complete()}>
            <CheckCircle2 size={15} />
            Complete
          </Button>
        ) : null}
        {isRunning || isPaused || isCompleted ? (
          <Button variant="ghost" onClick={() => reset()}>
            <RotateCcw size={15} />
            Reset
          </Button>
        ) : null}
      </div>

      <div className="focus-timer-meta">
        <span>
          {sessions.length} session{sessions.length === 1 ? "" : "s"} logged
        </span>
        {isCompleted ? <span>{elapsedSeconds} seconds recorded</span> : null}
      </div>
    </Card>
  );
}

export default FocusTimer;
