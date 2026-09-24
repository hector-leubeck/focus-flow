import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TaskForm from "./TaskForm";

describe("TaskForm keyboard interactions", () => {
  it("focuses the form, traps tab at the end, and closes on Escape", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />);

    const dialog = screen.getByRole("dialog", { name: "New task" });
    const submit = screen.getByRole("button", { name: "Add task" });
    const close = screen.getByRole("button", { name: "Close" });

    expect(close).toHaveFocus();

    submit.focus();
    await user.tab();
    expect(close).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
