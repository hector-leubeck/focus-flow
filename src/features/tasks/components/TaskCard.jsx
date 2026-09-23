import { CalendarDays, CircleAlert } from "lucide-react";
import Badge from "../../../shared/components/Badge";
import Card from "../../../shared/components/Card";
import "./TaskCard.css";

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

function isPastDue(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(`${date}T00:00:00`);

  return dueDate < today;
}

function formatDueDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function TaskCard({ task }) {
  const overdue = isPastDue(task.dueDate);

  return (
    <Card
      as="article"
      className={`task-card task-card-priority-${task.priority}${overdue ? " is-overdue" : ""}`}
      aria-labelledby={`task-${task.id}-title`}
    >
      <div className="task-card-topline">
        <Badge tone={task.priority === "high" ? "danger" : "neutral"}>
          {priorityLabels[task.priority]}
        </Badge>
        {overdue ? (
          <span className="task-overdue-label">
            <CircleAlert size={13} aria-hidden="true" />
            Overdue
          </span>
        ) : null}
      </div>

      <div className="task-card-content">
        <h3 id={`task-${task.id}-title`}>{task.title}</h3>
        {task.description ? <p>{task.description}</p> : null}
      </div>

      <div className="task-card-footer">
        <div className="task-tags" aria-label="Task tags">
          {task.tags.map((tag) => (
            <Badge key={tag} tone="success">
              {tag}
            </Badge>
          ))}
        </div>
        <time
          className="task-due-date"
          dateTime={task.dueDate}
          aria-label={`${overdue ? "Overdue, " : "Due "}${formatDueDate(task.dueDate)}`}
        >
          <CalendarDays size={13} aria-hidden="true" />
          {formatDueDate(task.dueDate)}
        </time>
      </div>
    </Card>
  );
}

export default TaskCard;
