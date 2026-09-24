import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import AnalyticsPanel from "./AnalyticsPanel";
import { useFocusTimerStore } from "../../focus-timer/store/focusTimerStore";
import { useTasksStore } from "../../tasks/store/tasksStore";

describe("AnalyticsPanel user-visible states", () => {
  beforeEach(() => {
    localStorage.clear();
    useTasksStore.setState({ tasks: [] });
    useFocusTimerStore.setState({ sessions: [] });
  });

  it("shows zero metrics and an empty activity state without data", () => {
    render(<AnalyticsPanel />);

    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("No data")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "No focus activity in the last 7 days.",
    );
  });

  it("shows real task and focus metrics when stores contain activity", () => {
    useTasksStore.setState({
      tasks: [
        { id: "done", title: "Done", status: "completed" },
        { id: "open", title: "Open", status: "backlog" },
      ],
    });
    useFocusTimerStore.setState({
      sessions: [
        {
          id: "session-1",
          durationSeconds: 1500,
          completedAt: new Date().toISOString(),
        },
      ],
    });

    render(<AnalyticsPanel />);

    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("25m")).toBeInTheDocument();
    expect(screen.getByText("1 session")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Focus activity chart/ }),
    ).toBeInTheDocument();
  });
});
