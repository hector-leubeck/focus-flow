import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import TaskPreview from "./TaskPreview";
import { useTasksStore } from "../store/tasksStore";

describe("TaskPreview user flows", () => {
  beforeEach(() => {
    localStorage.clear();
    useTasksStore.setState({ tasks: [] });
  });

  it("creates a task from the dialog and places it in the selected column", async () => {
    const user = userEvent.setup();

    render(<TaskPreview />);
    await user.click(screen.getByRole("button", { name: "Add task" }));
    await user.type(
      screen.getByRole("textbox", { name: "Title" }),
      "Write brief",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Description" }),
      "Turn the notes into a concise brief.",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Status" }),
      "in-progress",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Priority" }),
      "high",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Tags" }),
      "Writing, Product",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Due date" }),
      "2026-09-28",
    );
    await user.click(screen.getByRole("button", { name: "Add task" }));

    const inProgress = screen.getByRole("region", { name: "In progress" });
    expect(
      within(inProgress).getByRole("article", { name: "Write brief" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Task Write brief added.",
    );
  });

  it("edits and deletes a task through its card actions", async () => {
    const user = userEvent.setup();
    useTasksStore.setState({
      tasks: [
        {
          id: "task-1",
          title: "Draft notes",
          description: "Initial notes",
          priority: "low",
          tags: ["Writing"],
          dueDate: "2026-09-28",
          status: "backlog",
          order: 0,
        },
      ],
    });

    render(<TaskPreview />);
    await user.click(screen.getByRole("button", { name: "Edit Draft notes" }));
    const title = screen.getByRole("textbox", { name: "Title" });
    await user.clear(title);
    await user.type(title, "Final notes");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      screen.getByRole("article", { name: "Final notes" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Task Final notes updated.",
    );

    await user.click(
      screen.getByRole("button", { name: "Delete Final notes" }),
    );
    expect(
      screen.queryByRole("article", { name: "Final notes" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Task Final notes deleted.",
    );
  });
});
