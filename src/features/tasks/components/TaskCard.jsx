import {
  CalendarDays,
  CircleAlert,
  Edit3,
  GripVertical,
  Trash2,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Badge from '../../../shared/components/Badge';
import Card from '../../../shared/components/Card';
import IconButton from '../../../shared/components/IconButton';
import './TaskCard.css';

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

function parseDueDate(date) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function isPastDue(date) {
  const dueDate = parseDueDate(date);

  if (!dueDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return dueDate < today;
}

function formatDueDate(date) {
  const dueDate = parseDueDate(date);

  if (!dueDate) {
    return null;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(dueDate);
}

function TaskCard({ task, onEdit, onDelete, dragHandleProps, isDragging }) {
  const overdue = isPastDue(task.dueDate);
  const formattedDueDate = formatDueDate(task.dueDate);
  const reduceMotion = useReducedMotion();

  const cardMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        layout: true,
        transition: { duration: 0.18, ease: 'easeOut' },
      };

  return (
    <Card
      as={motion.article}
      className={`task-card task-card-priority-${task.priority}${
        overdue ? ' is-overdue' : ''
      }${isDragging ? ' is-dragging' : ''}`}
      aria-labelledby={`task-${task.id}-title`}
      {...cardMotion}
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

        <Badge tone={task.priority === 'high' ? 'danger' : 'neutral'}>
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
        <ul className="task-tags" aria-label="Task tags">
          {task.tags.map((tag) => (
            <li key={tag}>
              <Badge tone="success">{tag}</Badge>
            </li>
          ))}
        </ul>

        <div className="task-card-actions">
          {formattedDueDate ? (
            <time
              className="task-due-date"
              dateTime={task.dueDate}
              aria-label={`${overdue ? 'Overdue, ' : 'Due '}${formattedDueDate}`}
            >
              <CalendarDays size={13} aria-hidden="true" />
              {formattedDueDate}
            </time>
          ) : null}

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
