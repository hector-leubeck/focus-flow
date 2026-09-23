import { beforeEach, describe, expect, it } from "vitest";
import { useTasksStore } from "./tasksStore";

describe("tasksStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useTasksStore.setState({ tasks: [] });
  });

  it("creates a task", () => {
    const task = useTasksStore.getState().addTask({
      title: "Write brief",
      dueDate: "2026-09-25",
    });

    expect(task.title).toBe("Write brief");
    expect(useTasksStore.getState().tasks).toHaveLength(1);
    expect(useTasksStore.getState().tasks[0].status).toBe("backlog");
  });

  it("edits an existing task without changing its id", () => {
    const created = useTasksStore.getState().addTask({ title: "Draft notes" });

    useTasksStore.getState().updateTask(created.id, {
      title: "Draft final notes",
      priority: "high",
    });

    expect(useTasksStore.getState().tasks[0]).toMatchObject({
      id: created.id,
      title: "Draft final notes",
      priority: "high",
    });
  });

  it("deletes a task", () => {
    const created = useTasksStore.getState().addTask({ title: "Remove me" });

    useTasksStore.getState().deleteTask(created.id);

    expect(useTasksStore.getState().tasks).toEqual([]);
  });

  it("changes a task status", () => {
    const created = useTasksStore.getState().addTask({ title: "Move me" });

    useTasksStore.getState().updateTaskStatus(created.id, "completed");

    expect(useTasksStore.getState().tasks[0].status).toBe("completed");
  });

  it("reorders tasks within the same column", () => {
    useTasksStore.setState({
      tasks: [
        { id: "first", title: "First", status: "backlog", order: 0 },
        { id: "second", title: "Second", status: "backlog", order: 1 },
      ],
    });

    useTasksStore.getState().moveTask({
      activeId: "second",
      overId: "first",
      targetStatus: "backlog",
    });

    expect(useTasksStore.getState().tasks).toMatchObject([
      { id: "second", status: "backlog", order: 0 },
      { id: "first", status: "backlog", order: 1 },
    ]);
  });

  it("moves a task to another column and preserves target order", () => {
    useTasksStore.setState({
      tasks: [
        { id: "backlog-task", title: "Backlog", status: "backlog", order: 0 },
        {
          id: "progress-task",
          title: "Progress",
          status: "in-progress",
          order: 0,
        },
      ],
    });

    useTasksStore.getState().moveTask({
      activeId: "backlog-task",
      overId: "progress-task",
      targetStatus: "in-progress",
    });

    expect(useTasksStore.getState().tasks).toMatchObject([
      { id: "backlog-task", status: "in-progress", order: 0 },
      { id: "progress-task", status: "in-progress", order: 1 },
    ]);
  });
});
