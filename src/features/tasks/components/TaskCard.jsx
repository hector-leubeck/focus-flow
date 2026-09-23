import {
  CalendarDays,
  CircleAlert,
  Edit3,
  GripVertical,
  Trash2,
} from "lucide-react";
import Badge from "../../../shared/components/Badge";
import Card from "../../../shared/components/Card";
import IconButton from "../../../shared/components/IconButton";
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

function TaskCard({ task, onEdit, onDelete, dragHandleProps, isDragging }) {
  const overdue = isPastDue(task.dueDate);

  return (
    <Card
      as="article"
      className={`task-card task-card-priority-${task.priority}${overdue ? " is-overdue" : ""}${isDragging ? " is-dragging" : ""}`}
      aria-labelledby={`task-${task.id}-title`}
    >
      <div className="task-card-topline">
        {dragHandleProps ? (
          <button
            className="task-drag-handle"
            type="button"
            aria-label={`Move ${task.title}`}
            {...dragHandleProps}
          >
            <GripVertical size={15} aria-hidden="true" />
          </button>
        ) : null}
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
        <div className="task-card-actions">
          <time
            className="task-due-date"
            dateTime={task.dueDate}
            aria-label={`${overdue ? "Overdue, " : "Due "}${formatDueDate(task.dueDate)}`}
          >
            <CalendarDays size={13} aria-hidden="true" />
            {formatDueDate(task.dueDate)}
          </time>
          {onEdit ? (
            <IconButton
              label={`Edit ${task.title}`}
              onClick={() => onEdit(task)}
            >
              <Edit3 size={14} />
            </IconButton>
          ) : null}
          {onDelete ? (
            <IconButton
              label={`Delete ${task.title}`}
              onClick={() => onDelete(task.id)}
            >
              <Trash2 size={14} />
            </IconButton>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export default TaskCard;
