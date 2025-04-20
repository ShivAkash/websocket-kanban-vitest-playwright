import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';
import Task from './Task';

const Column = ({ id, title, tasks, onTaskMove }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item) => {
      if (item.column !== id) {
        onTaskMove(item.id, item.column, id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        flex: 1,
        margin: '10px',
        padding: '20px',
        backgroundColor: isOver ? '#f0f0f0' : 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minHeight: '400px'
      }}
    >
      <h2 style={{ marginBottom: '20px', color: '#333' }}>{title}</h2>
      <div style={{ minHeight: '100px' }}>
        {tasks
          .filter((task) => task.column === id)
          .map((task) => (
            <Task
              key={task.id}
              task={task}
              onTaskMove={onTaskMove}
            />
          ))}
      </div>
    </div>
  );
};

export default Column; 