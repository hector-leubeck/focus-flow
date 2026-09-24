import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import Button from "../../../shared/components/Button";
import SectionHeader from "../../../shared/components/SectionHeader";
import { selectTasksByStatus } from "../selectors/taskSelectors";
import { useTasksStore } from "../store/tasksStore";
import { TASK_STATUSES } from "../taskModel";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import "./TaskPreview.css";

const columns = [
  { id: TASK_STATUSES.BACKLOG, title: "Backlog" },
  { id: TASK_STATUSES.IN_PROGRESS, title: "In progress" },
  { id: TASK_STATUSES.COMPLETED, title: "Completed" },
];

function SortableTaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  return (
    <li
      ref={setNodeRef}
      className="sortable-task-card"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <TaskCard
        task={task}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </li>
  );
}

function TaskColumn({ column, tasks, onEdit, onDelete }) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });

  return (
    <section
      className="task-column-preview"
      aria-labelledby={`${column.id}-title`}
    >
      <div className="task-column-heading">
        <h3 id={`${column.id}-title`}>{column.title}</h3>
        <span aria-label={`${tasks.length} tasks`}>{tasks.length}</span>
      </div>
      <ul
        ref={setNodeRef}
        className={`task-column-list${isOver ? " is-over" : ""}`}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </ul>
    </section>
  );
}

function TaskPreview() {
  const [editingTask, setEditingTask] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const tasks = useTasksStore((state) => state.tasks);
  const addTask = useTasksStore((state) => state.addTask);
  const updateTask = useTasksStore((state) => state.updateTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);
  const moveTask = useTasksStore((state) => state.moveTask);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const activeTask = tasks.find((task) => task.id === activeTaskId);

  function closeForm() {
    setIsCreating(false);
    setEditingTask(null);
  }

  function handleSubmit(values) {
    if (editingTask) {
      updateTask(editingTask.id, values);
      setAnnouncement(`Task ${values.title} updated.`);
    } else {
      addTask(values);
      setAnnouncement(`Task ${values.title} added.`);
    }

    closeForm();
  }

  function handleDelete(taskId) {
    const task = tasks.find((item) => item.id === taskId);

    deleteTask(taskId);
    setAnnouncement(task ? `Task ${task.title} deleted.` : "Task deleted.");
  }

  function handleDragStart({ active }) {
    setActiveTaskId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveTaskId(null);

    if (!over) {
      return;
    }

    const targetStatus = columns.some((column) => column.id === over.id)
      ? over.id
      : tasks.find((task) => task.id === over.id)?.status;

    if (targetStatus) {
      moveTask({
        activeId: active.id,
        overId: over.id,
        targetStatus,
      });
      const movedTask = tasks.find((task) => task.id === active.id);
      const targetColumn = columns.find((column) => column.id === targetStatus);

      setAnnouncement(
        movedTask && targetColumn
          ? `${movedTask.title} moved to ${targetColumn.title}.`
          : "Task position updated.",
      );
    }
  }

  return (
    <section className="task-preview" id="tasks" aria-label="Tasks">
      <SectionHeader
        className="task-preview-header"
        eyebrow="01 / Organize"
        title="Tasks"
        description="A calm view of what is moving, waiting, and done."
      >
        <Button
          variant="secondary"
          size="small"
          type="button"
          onClick={() => setIsCreating(true)}
        >
          <Plus size={14} />
          Add task
        </Button>
      </SectionHeader>
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragCancel={() => setActiveTaskId(null)}
        onDragEnd={handleDragEnd}
      >
        <div className="task-board-preview">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              tasks={selectTasksByStatus(tasks, column.id)}
              onEdit={setEditingTask}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
      <AnimatePresence>
        {isCreating || editingTask ? (
          <TaskForm
            key={editingTask?.id ?? "new-task"}
            task={editingTask}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export default TaskPreview;
