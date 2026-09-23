import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mockTasks } from "../mockTasks";
import { createTask, TASK_STATUSES } from "../taskModel";

const statusOrder = Object.values(TASK_STATUSES);

function normalizeTaskOrder(tasks) {
  return statusOrder.flatMap((status) =>
    tasks
      .filter((task) => task.status === status)
      .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
      .map((task, order) => ({ ...task, order })),
  );
}

function moveTaskInList(tasks, activeId, overId, targetStatus) {
  const activeTask = tasks.find((task) => task.id === activeId);

  if (
    !activeTask ||
    activeId === overId ||
    !statusOrder.includes(targetStatus)
  ) {
    return tasks;
  }

  const orderedTasks = normalizeTaskOrder(tasks);
  const withoutActive = orderedTasks.filter((task) => task.id !== activeId);
  const targetTasks = withoutActive.filter(
    (task) => task.status === targetStatus,
  );
  const targetIndex = targetTasks.findIndex((task) => task.id === overId);
  const insertAt = targetIndex === -1 ? targetTasks.length : targetIndex;
  const movedTask = { ...activeTask, status: targetStatus, order: insertAt };
  const nextTargetTasks = [...targetTasks];

  nextTargetTasks.splice(insertAt, 0, movedTask);

  return normalizeTaskOrder([
    ...withoutActive.filter((task) => task.status !== targetStatus),
    ...nextTargetTasks.map((task, order) => ({ ...task, order })),
  ]);
}

export const useTasksStore = create(
  persist(
    (set) => ({
      tasks: normalizeTaskOrder(mockTasks),

      addTask: (input) => {
        let task;

        set((state) => {
          const status = input.status ?? TASK_STATUSES.BACKLOG;
          const order = state.tasks.filter(
            (item) => item.status === status,
          ).length;
          task = createTask({ ...input, order });

          return { tasks: normalizeTaskOrder([...state.tasks, task]) };
        });
        return task;
      },

      updateTask: (id, updates) => {
        set((state) => {
          const currentTask = state.tasks.find((task) => task.id === id);
          const nextTasks = state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates, id: task.id } : task,
          );

          if (
            currentTask &&
            updates.status &&
            updates.status !== currentTask.status
          ) {
            return {
              tasks: moveTaskInList(
                nextTasks,
                id,
                updates.status,
                updates.status,
              ),
            };
          }

          return { tasks: normalizeTaskOrder(nextTasks) };
        });
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: normalizeTaskOrder(
            state.tasks.filter((task) => task.id !== id),
          ),
        }));
      },

      updateTaskStatus: (id, status) => {
        set((state) => ({
          tasks: moveTaskInList(state.tasks, id, status, status),
        }));
      },

      moveTask: ({ activeId, overId, targetStatus }) => {
        set((state) => ({
          tasks: moveTaskInList(state.tasks, activeId, overId, targetStatus),
        }));
      },
    }),
    {
      name: "focusflow-tasks",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
