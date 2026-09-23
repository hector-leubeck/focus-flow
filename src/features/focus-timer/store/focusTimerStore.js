import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLocalStorage } from "../../../shared/lib/persistence";
import { DEFAULT_FOCUS_DURATION_SECONDS, TIMER_STATUSES } from "../timerConfig";
import { getElapsedSeconds, getRemainingSeconds } from "../timerUtils";

const initialTimerState = {
  status: TIMER_STATUSES.IDLE,
  durationSeconds: DEFAULT_FOCUS_DURATION_SECONDS,
  elapsedSeconds: 0,
  remainingSeconds: DEFAULT_FOCUS_DURATION_SECONDS,
  startedAt: null,
  sessions: [],
};

function sanitizeSessions(sessions) {
  if (!Array.isArray(sessions)) {
    return [];
  }

  return sessions.filter(
    (session) =>
      session &&
      typeof session.id === "string" &&
      Number.isFinite(session.durationSeconds) &&
      session.durationSeconds >= 0 &&
      typeof session.completedAt === "string",
  );
}

function sanitizeDuration(durationSeconds) {
  return Number.isFinite(durationSeconds) && durationSeconds > 0
    ? Math.floor(durationSeconds)
    : DEFAULT_FOCUS_DURATION_SECONDS;
}

export const useFocusTimerStore = create(
  persist(
    (set, get) => ({
      ...initialTimerState,

      start: (now = Date.now()) => {
        set({
          status: TIMER_STATUSES.RUNNING,
          elapsedSeconds: 0,
          remainingSeconds: get().durationSeconds,
          startedAt: now,
        });
      },

      pause: (now = Date.now()) => {
        const timer = get();

        if (timer.status !== TIMER_STATUSES.RUNNING) {
          return;
        }

        const elapsedSeconds = getElapsedSeconds(timer, now);

        set({
          status: TIMER_STATUSES.PAUSED,
          elapsedSeconds,
          remainingSeconds: timer.durationSeconds - elapsedSeconds,
          startedAt: null,
        });
      },

      resume: (now = Date.now()) => {
        const timer = get();

        if (timer.status !== TIMER_STATUSES.PAUSED) {
          return;
        }

        set({
          status: TIMER_STATUSES.RUNNING,
          startedAt: now,
        });
      },

      reset: () => {
        set((timer) => ({
          status: TIMER_STATUSES.IDLE,
          elapsedSeconds: 0,
          remainingSeconds: timer.durationSeconds,
          startedAt: null,
        }));
      },

      complete: (now = Date.now()) => {
        const timer = get();
        const elapsedSeconds = getElapsedSeconds(timer, now);

        if (elapsedSeconds === 0 && timer.status !== TIMER_STATUSES.RUNNING) {
          return;
        }

        set({
          status: TIMER_STATUSES.COMPLETED,
          elapsedSeconds,
          remainingSeconds: 0,
          startedAt: null,
          sessions: [
            ...timer.sessions,
            {
              id: `session-${now}-${timer.sessions.length}`,
              durationSeconds: elapsedSeconds,
              completedAt: new Date(now).toISOString(),
            },
          ],
        });
      },

      getRemainingSeconds: (now = Date.now()) =>
        getRemainingSeconds(get(), now),
    }),
    {
      name: "focusflow-focus-timer",
      storage: safeLocalStorage,
      partialize: ({ durationSeconds, sessions }) => ({
        durationSeconds,
        sessions,
      }),
      merge: (persistedState, currentState) => {
        const durationSeconds = sanitizeDuration(
          persistedState?.durationSeconds,
        );

        return {
          ...currentState,
          durationSeconds,
          remainingSeconds: durationSeconds,
          elapsedSeconds: 0,
          startedAt: null,
          status: TIMER_STATUSES.IDLE,
          sessions: sanitizeSessions(persistedState?.sessions),
        };
      },
    },
  ),
);
