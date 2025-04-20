import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import Select from 'react-select';

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const categoryOptions = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'enhancement', label: 'Enhancement' }
];

function TaskCard({ task, column, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const handleUpdate = () => {
    onUpdateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getFileType = (file) => {
    if (typeof file === 'string') {
      return file.endsWith('.pdf') ? 'pdf' : 'image';
    }
    return file.type?.startsWith('image/') ? 'image' : 'pdf';
  };

  return (
    <div
      ref={drag}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      style={{
        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        transition: 'opacity 0.2s ease'
      }}
    >
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          />
          <textarea
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          />
          <Select
            options={priorityOptions}
            value={priorityOptions.find(opt => opt.value === editedTask.priority)}
            onChange={(opt) => setEditedTask({ ...editedTask, priority: opt.value })}
          />
          <Select
            options={categoryOptions}
            value={categoryOptions.find(opt => opt.value === editedTask.category)}
            onChange={(opt) => setEditedTask({ ...editedTask, category: opt.value })}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <div className="task-header">
            <h4>{task.title}</h4>
            <div className="task-actions">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDeleteTask(task.id)}>Delete</button>
            </div>
          </div>
          <p>{task.description}</p>
          <div className="task-meta">
            <span className={`priority ${task.priority}`}>{task.priority}</span>
            <span className={`category ${task.category}`}>{task.category}</span>
          </div>
          {task.attachments && task.attachments.length > 0 && (
            <div className="attachments">
              <h5>Attachments:</h5>
              <div className="attachment-tags">
                {task.attachments.map((file, index) => {
                  const fileType = getFileType(file);
                  const fileUrl = typeof file === 'string' ? file : file.url;
                  const fileName = typeof file === 'string' ? `Attachment ${index + 1}` : file.name;

                  return (
                    <div key={index} className="attachment-tag">
                      <span>{fileName}</span>
                      {fileType === 'image' ? (
                        <img src={fileUrl} alt={fileName} className="attachment-preview" />
                      ) : (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="attachment-link">
                          View PDF
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TaskCard; 