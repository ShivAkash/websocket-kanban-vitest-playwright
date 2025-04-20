import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';

const Task = ({ task, onTaskMove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, column: task.column },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDelete = () => {
    onTaskMove(task.id, task.column, 'deleted');
  };

  return (
    <div
      ref={drag}
      className={`task ${isDragging ? 'dragging' : ''}`}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        padding: '10px',
        margin: '5px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
      }}
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-meta">
        <span>Priority: {task.priority}</span>
        <span>Category: {task.category}</span>
      </div>
      <button 
        onClick={handleDelete}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default Task; 