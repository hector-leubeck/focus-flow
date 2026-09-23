import { Plus } from "lucide-react";
import Button from "../../../shared/components/Button";
import SectionHeader from "../../../shared/components/SectionHeader";
import { mockTasks } from "../mockTasks";
import TaskCard from "./TaskCard";
import "./TaskPreview.css";

const columns = [
  { id: "backlog", title: "Backlog" },
  { id: "in-progress", title: "In progress" },
  { id: "completed", title: "Completed" },
];

function TaskPreview() {
  return (
    <section className="task-preview" id="tasks" aria-labelledby="tasks-title">
      <SectionHeader
        className="task-preview-header"
        eyebrow="01 / Organize"
        title="Tasks"
        description="A calm view of what is moving, waiting, and done."
      >
        <Button variant="secondary" size="small" disabled>
          <Plus size={14} />
          Add task
        </Button>
      </SectionHeader>
      <div className="task-board-preview">
        {columns.map((column) => {
          const columnTasks = mockTasks.filter(
            (task) => task.status === column.id,
          );

          return (
            <section
              className="task-column-preview"
              key={column.id}
              aria-labelledby={`${column.id}-title`}
            >
              <div className="task-column-heading">
                <h3 id={`${column.id}-title`}>{column.title}</h3>
                <span>{columnTasks.length}</span>
              </div>
              <div className="task-column-list">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

export default TaskPreview;
