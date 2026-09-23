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

function createTaskId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createTask(input = {}) {
  return {
    id: input.id ?? createTaskId(),
    title: input.title?.trim() ?? "",
    description: input.description?.trim() ?? "",
    priority: input.priority ?? TASK_PRIORITIES.MEDIUM,
    tags: Array.isArray(input.tags) ? input.tags : [],
    dueDate: input.dueDate ?? "",
    status: input.status ?? TASK_STATUSES.BACKLOG,
    order: input.order ?? 0,
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}
