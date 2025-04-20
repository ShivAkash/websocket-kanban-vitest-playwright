import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskCard from '../../components/TaskCard';
import { describe, it, expect, vi } from 'vitest';

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  priority: 'medium',
  category: 'feature',
  attachments: []
};

const renderWithDnd = (component) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      {component}
    </DndProvider>
  );
};

describe('TaskCard', () => {
  it('renders task details correctly', () => {
    renderWithDnd(
      <TaskCard
        task={mockTask}
        column="todo"
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('feature')).toBeInTheDocument();
  });

  it('enters edit mode when edit button is clicked', () => {
    renderWithDnd(
      <TaskCard
        task={mockTask}
        column="todo"
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('calls onDeleteTask when delete button is clicked', () => {
    const onDeleteMock = vi.fn();
    renderWithDnd(
      <TaskCard
        task={mockTask}
        column="todo"
        onUpdateTask={() => {}}
        onDeleteTask={onDeleteMock}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(onDeleteMock).toHaveBeenCalledWith(mockTask.id);
  });

  it('calls onUpdateTask with updated values when save is clicked', () => {
    const onUpdateMock = vi.fn();
    renderWithDnd(
      <TaskCard
        task={mockTask}
        column="todo"
        onUpdateTask={onUpdateMock}
        onDeleteTask={() => {}}
      />
    );

    // Enter edit mode
    fireEvent.click(screen.getByText('Edit'));

    // Update title
    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });

    // Save changes
    fireEvent.click(screen.getByText('Save'));

    expect(onUpdateMock).toHaveBeenCalledWith(mockTask.id, expect.objectContaining({
      title: 'Updated Task'
    }));
  });
}); 