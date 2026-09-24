import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Button from "../../../shared/components/Button";
import { TASK_PRIORITIES, TASK_STATUSES } from "../taskModel";
import "./TaskForm.css";

const statusLabels = {
  [TASK_STATUSES.BACKLOG]: "Backlog",
  [TASK_STATUSES.IN_PROGRESS]: "In progress",
  [TASK_STATUSES.COMPLETED]: "Completed",
};

function TaskForm({ task, onSubmit, onCancel }) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? TASK_PRIORITIES.MEDIUM,
    tags: task?.tags?.join(", ") ?? "",
    dueDate: task?.dueDate ?? "",
    status: task?.status ?? TASK_STATUSES.BACKLOG,
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousActiveElement = document.activeElement;

    if (!dialog) {
      return undefined;
    }

    const focusableSelector =
      'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [href], [tabindex]:not([tabindex="-1"])';
    const focusFirstField = () =>
      dialog.querySelector(focusableSelector)?.focus();

    focusFirstField();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = [...dialog.querySelectorAll(focusableSelector)];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    dialog.addEventListener("keydown", handleKeyDown);

    return () => {
      dialog.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [onCancel]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      ...form,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  }

  return (
    <motion.div
      className="task-dialog-backdrop"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.16 }}
    >
      <motion.dialog
        ref={dialogRef}
        className="task-dialog"
        open
        aria-labelledby="task-dialog-title"
        initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 6, scale: 0.99 }}
        transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
      >
        <div className="task-dialog-header">
          <div>
            <p className="ds-eyebrow">Task details</p>
            <h2 id="task-dialog-title">{task ? "Edit task" : "New task"}</h2>
          </div>
          <Button variant="ghost" size="small" type="button" onClick={onCancel}>
            Close
          </Button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              required
              autoFocus
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              rows="3"
            />
          </label>
          <div className="task-form-grid">
            <label>
              Priority
              <select
                name="priority"
                value={form.priority}
                onChange={updateField}
              >
                <option value={TASK_PRIORITIES.LOW}>Low</option>
                <option value={TASK_PRIORITIES.MEDIUM}>Medium</option>
                <option value={TASK_PRIORITIES.HIGH}>High</option>
              </select>
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={updateField}>
                {Object.values(TASK_STATUSES).map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="task-form-grid">
            <label>
              Tags
              <input
                name="tags"
                value={form.tags}
                onChange={updateField}
                placeholder="Design, Client"
              />
            </label>
            <label>
              Due date
              <input
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={updateField}
                required
              />
            </label>
          </div>
          <div className="task-form-actions">
            <Button variant="ghost" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Save changes" : "Add task"}</Button>
          </div>
        </form>
      </motion.dialog>
    </motion.div>
  );
}

export default TaskForm;
