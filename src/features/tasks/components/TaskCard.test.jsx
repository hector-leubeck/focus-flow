import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TaskCard from "./TaskCard";

const baseTask = {
  id: "task-1",
  title: "Review project brief",
  description: "Make the final pass before sharing it with the team.",
  priority: "medium",
  tags: ["Writing", "Product"],
  dueDate: "2026-09-25",
};

describe("TaskCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-23T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the task content, priority, tags, and due date", () => {
    render(<TaskCard task={baseTask} />);

    expect(
      screen.getByRole("heading", { name: "Review project brief" }),
    ).toBeInTheDocument();
    expect(screen.getByText(baseTask.description)).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Writing")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Sep 25")).toBeInTheDocument();
  });

  it("omits the description when the task has none", () => {
    render(<TaskCard task={{ ...baseTask, description: "" }} />);

    expect(screen.queryByText(baseTask.description)).not.toBeInTheDocument();
  });

  it("marks an overdue task with accessible status text", () => {
    render(
      <TaskCard
        task={{ ...baseTask, dueDate: "2026-09-21", priority: "high" }}
      />,
    );

    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.getByLabelText("Overdue, Sep 21")).toBeInTheDocument();
  });

  it("does not mark a future task as overdue", () => {
    render(
      <TaskCard
        task={{ ...baseTask, dueDate: "2026-09-26", priority: "low" }}
      />,
    );

    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.queryByText("Overdue")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Due Sep 26")).toBeInTheDocument();
  });
});
