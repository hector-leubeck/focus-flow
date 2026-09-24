import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import FocusTimer from "./FocusTimer";
import { DEFAULT_FOCUS_DURATION_SECONDS, TIMER_STATUSES } from "../timerConfig";
import { useFocusTimerStore } from "../store/focusTimerStore";

describe("FocusTimer user flows", () => {
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

  it("supports start, pause, resume, complete, and reset", async () => {
    const user = userEvent.setup();

    render(<FocusTimer />);
    await user.click(screen.getByRole("button", { name: "Start focus" }));
    expect(screen.getByText("Focus in progress")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByText("Focus paused")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Resume" }));
    expect(screen.getByText("Focus in progress")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Complete" }));
    expect(screen.getByText("Session complete")).toBeInTheDocument();
    expect(screen.getByText("1 session logged")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByText("Ready to focus")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Start focus" }),
    ).toBeInTheDocument();
  });
});
