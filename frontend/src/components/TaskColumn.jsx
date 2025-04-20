import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';

function TaskColumn({ title, tasks, column, onMoveTask, onUpdateTask, onDeleteTask }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      if (item.column !== column) {
        onMoveTask(item.id, item.column, column);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div
      ref={drop}
      className={`column ${isOver ? 'column-over' : ''}`}
      style={{
        backgroundColor: isOver ? '#e8e8e8' : '#f5f5f5',
        transition: 'background-color 0.2s ease'
      }}
    >
      <h3>{title}</h3>
      <div className="tasks">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            column={column}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskColumn; 