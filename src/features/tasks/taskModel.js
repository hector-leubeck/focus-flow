export const TASK_STATUSES = {
  BACKLOG: "backlog",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

export const TASK_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

const taskStatuses = Object.values(TASK_STATUSES);
const taskPriorities = Object.values(TASK_PRIORITIES);

function createTaskId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createTask(input = {}) {
  const source = input && typeof input === "object" ? input : {};

  return {
    id: typeof source.id === "string" && source.id ? source.id : createTaskId(),
    title: typeof source.title === "string" ? source.title.trim() : "",
    description:
      typeof source.description === "string" ? source.description.trim() : "",
    priority: taskPriorities.includes(source.priority)
      ? source.priority
      : TASK_PRIORITIES.MEDIUM,
    tags: Array.isArray(source.tags)
      ? source.tags.filter((tag) => typeof tag === "string")
      : [],
    dueDate: typeof source.dueDate === "string" ? source.dueDate : "",
    status: taskStatuses.includes(source.status)
      ? source.status
      : TASK_STATUSES.BACKLOG,
    order:
      Number.isFinite(source.order) && source.order >= 0 ? source.order : 0,
    createdAt:
      typeof source.createdAt === "string"
        ? source.createdAt
        : new Date().toISOString(),
  };
}

export function sanitizeStoredTasks(tasks) {
  if (!Array.isArray(tasks)) {
    return null;
  }

  return tasks
    .filter(
      (task) =>
        task &&
        typeof task === "object" &&
        typeof task.id === "string" &&
        task.id.trim() &&
        typeof task.title === "string",
    )
    .map((task) => createTask(task));
}
