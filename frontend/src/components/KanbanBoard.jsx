import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { io } from 'socket.io-client';
import TaskColumn from './TaskColumn';
import TaskForm from './TaskForm';
import TaskProgressChart from './TaskProgressChart';
import './styles.css';


const createSocket = () => {
  console.log('Connecting to API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000');
  return io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 20000,
    autoConnect: true,
    path: '/socket.io/',
    forceNew: true
  });
};

function KanbanBoard({ socket = createSocket() }) {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    
    socket.on('connect', () => {
      console.log('Socket connected successfully!');
      setConnected(true);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setConnected(false);
    });

    socket.on('sync:tasks', (updatedTasks) => {
      console.log('Received task sync:', updatedTasks);
      setTasks(prevTasks => ({
        ...prevTasks,
        ...updatedTasks
      }));
    });

    
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('sync:tasks');
    };
  }, [socket]);

  const handleCreateTask = (task) => {
    console.log('Emitting task creation:', task);
    socket.emit('task:create', task);
  };

  const handleUpdateTask = (taskId, updatedTask) => {
    socket.emit('task:update', { taskId, updatedTask });
  };

  const handleDeleteTask = (taskId) => {
    socket.emit('task:delete', taskId);
  };

  const handleMoveTask = (taskId, sourceColumn, targetColumn) => {
    if (sourceColumn === targetColumn) return;

    const taskToMove = tasks[sourceColumn].find(task => task.id === taskId);
    if (!taskToMove) return;

    const updatedTask = {
      ...taskToMove,
      status: targetColumn
    };

    socket.emit('task:update', { taskId, updatedTask });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-board">
        <TaskForm onCreateTask={handleCreateTask} />
        <div className="columns-container">
          <TaskColumn
            title="Todo"
            tasks={tasks.todo}
            column="todo"
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
          <TaskColumn
            title="In Progress"
            tasks={tasks.inProgress}
            column="inProgress"
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
          <TaskColumn
            title="Done"
            tasks={tasks.done}
            column="done"
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
        </div>
        <TaskProgressChart tasks={tasks} />
      </div>
    </DndProvider>
  );
}

export default KanbanBoard;
