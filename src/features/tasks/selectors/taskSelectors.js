export function selectTasksByStatus(tasks, status) {
  return tasks
    .filter((task) => task.status === status)
    .sort((first, second) => (first.order ?? 0) - (second.order ?? 0));
}

export function selectTaskCount(tasks, status) {
  return selectTasksByStatus(tasks, status).length;
}
