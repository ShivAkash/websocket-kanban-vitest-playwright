import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import KanbanBoard from '../../components/KanbanBoard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { io } from 'socket.io-client';


vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn()
  }))
}));

describe('KanbanBoard Integration', () => {
  let mockSocket;
  let syncTasksCallback;

  beforeEach(() => {
    
    vi.clearAllMocks();
    
    mockSocket = {
      on: vi.fn((event, callback) => {
        if (event === 'sync:tasks') {
          syncTasksCallback = callback;
        }
      }),
      emit: vi.fn(),
      off: vi.fn(),
      disconnect: vi.fn()
    };
    vi.mocked(io).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderKanbanBoard = () => {
    return render(
      <DndProvider backend={HTML5Backend}>
        <KanbanBoard socket={mockSocket} />
      </DndProvider>
    );
  };

  it('updates task details', async () => {
    const initialTasks = {
      todo: [{ id: '1', title: 'Test Task', description: 'Test Description', status: 'todo' }],
      inProgress: [],
      done: []
    };

    renderKanbanBoard();

    // Simulate initial data load
    syncTasksCallback(initialTasks);

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockSocket.emit).toHaveBeenCalledWith('task:update', {
        taskId: '1',
        updatedTask: expect.objectContaining({
          title: 'Updated Task'
        })
      });
    });

    // Simulate server response
    syncTasksCallback({
      todo: [{ id: '1', title: 'Updated Task', description: 'Test Description', status: 'todo' }],
      inProgress: [],
      done: []
    });

    await waitFor(() => {
      expect(screen.getByText('Updated Task')).toBeInTheDocument();
    });
  });

  it('deletes a task', async () => {
    const initialTasks = {
      todo: [{ id: '1', title: 'Test Task', description: 'Test Description', status: 'todo' }],
      inProgress: [],
      done: []
    };

    renderKanbanBoard();

    
    syncTasksCallback(initialTasks);

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockSocket.emit).toHaveBeenCalledWith('task:delete', '1');
    });

    
    syncTasksCallback({
      todo: [],
      inProgress: [],
      done: []
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
    });
  });
}); 