import { beforeEach, describe, expect, it } from "vitest";
import { safeLocalStorage } from "../../../shared/lib/persistence";
import { DEFAULT_FOCUS_DURATION_SECONDS, TIMER_STATUSES } from "../timerConfig";
import { useFocusTimerStore } from "./focusTimerStore";

describe("focusTimerStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useFocusTimerStore.setState({
      status: TIMER_STATUSES.IDLE,
      durationSeconds: DEFAULT_FOCUS_DURATION_SECONDS,
      elapsedSeconds: 0,
      remainingSeconds: DEFAULT_FOCUS_DURATION_SECONDS,
      startedAt: null,
      sessions: [],
    });
  });

  it("starts with the configured focus duration", () => {
    expect(useFocusTimerStore.getState().remainingSeconds).toBe(
      DEFAULT_FOCUS_DURATION_SECONDS,
    );
    expect(useFocusTimerStore.getState().status).toBe(TIMER_STATUSES.IDLE);
  });

  it("starts and pauses using elapsed timestamps", () => {
    const timer = useFocusTimerStore.getState();

    timer.start(1_000);
    timer.pause(31_000);

    expect(useFocusTimerStore.getState()).toMatchObject({
      status: TIMER_STATUSES.PAUSED,
      elapsedSeconds: 30,
      remainingSeconds: DEFAULT_FOCUS_DURATION_SECONDS - 30,
      startedAt: null,
    });
  });

  it("resumes from the paused elapsed time", () => {
    const timer = useFocusTimerStore.getState();

    timer.start(1_000);
    timer.pause(31_000);
    timer.resume(60_000);

    expect(useFocusTimerStore.getState()).toMatchObject({
      status: TIMER_STATUSES.RUNNING,
      elapsedSeconds: 30,
      startedAt: 60_000,
    });
  });

  it("completes and records a session with its timestamp", () => {
    const timer = useFocusTimerStore.getState();

    timer.start(1_000);
    timer.complete(61_000);

    expect(useFocusTimerStore.getState()).toMatchObject({
      status: TIMER_STATUSES.COMPLETED,
      remainingSeconds: 0,
      sessions: [
        {
          durationSeconds: 60,
          completedAt: "1970-01-01T00:01:01.000Z",
        },
      ],
    });
  });

  it("resets without deleting completed session history", () => {
    const timer = useFocusTimerStore.getState();

    timer.start(1_000);
    timer.complete(61_000);
    timer.reset();

    expect(useFocusTimerStore.getState()).toMatchObject({
      status: TIMER_STATUSES.IDLE,
      remainingSeconds: DEFAULT_FOCUS_DURATION_SECONDS,
      sessions: [
        {
          durationSeconds: 60,
          completedAt: "1970-01-01T00:01:01.000Z",
        },
      ],
    });
  });

  it("rehydrates sessions but discards a running timer state", async () => {
    safeLocalStorage.setItem("focusflow-focus-timer", {
      state: {
        status: TIMER_STATUSES.RUNNING,
        durationSeconds: DEFAULT_FOCUS_DURATION_SECONDS,
        elapsedSeconds: 120,
        startedAt: 1_000,
        sessions: [
          {
            id: "session-1",
            durationSeconds: 1_500,
            completedAt: "2026-09-23T10:00:00.000Z",
          },
        ],
      },
      version: 0,
    });

    await useFocusTimerStore.persist.rehydrate();

    expect(useFocusTimerStore.getState()).toMatchObject({
      status: TIMER_STATUSES.IDLE,
      elapsedSeconds: 0,
      startedAt: null,
      sessions: [
        {
          id: "session-1",
          durationSeconds: 1_500,
        },
      ],
    });
  });
});
