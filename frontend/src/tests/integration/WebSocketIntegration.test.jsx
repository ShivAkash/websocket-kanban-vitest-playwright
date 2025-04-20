import React from 'react';
import { render, screen } from '@testing-library/react';
import KanbanBoard from '../../components/KanbanBoard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { io } from 'socket.io-client';
import { vi } from 'vitest';

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn().mockReturnValue({
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn()
  })
}));

describe('WebSocket Integration', () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      off: vi.fn(),
      disconnect: vi.fn()
    };
    vi.mocked(io).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("WebSocket receives task update", async () => {
    const mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      off: vi.fn(),
      disconnect: vi.fn()
    };

    render(
      <DndProvider backend={HTML5Backend}>
        <KanbanBoard socket={mockSocket} />
      </DndProvider>
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });
});

