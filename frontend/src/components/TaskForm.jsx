import React, { useState } from 'react';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';

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

function TaskForm({ onCreateTask }) {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'feature',
    attachments: []
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const fileUrls = acceptedFiles.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type
      }));
      setNewTask(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileUrls]
      }));
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    }
  });

  const removeAttachment = (index) => {
    setNewTask(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new task with required fields
    const taskToCreate = {
      ...newTask,
      id: Date.now().toString(),
      status: 'todo',
      createdAt: new Date().toISOString()
    };

    console.log('Creating task:', taskToCreate);
    onCreateTask(taskToCreate);
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'feature',
      attachments: []
    });
  };

  return (
    <div className="task-form">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit} role="form">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
          required
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
        />
        <Select
          options={priorityOptions}
          value={priorityOptions.find(opt => opt.value === newTask.priority)}
          onChange={(opt) => setNewTask(prev => ({ ...prev, priority: opt.value }))}
          placeholder="Select Priority"
        />
        <Select
          options={categoryOptions}
          value={categoryOptions.find(opt => opt.value === newTask.category)}
          onChange={(opt) => setNewTask(prev => ({ ...prev, category: opt.value }))}
          placeholder="Select Category"
        />
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag & drop files here, or click to select files</p>
        </div>
        {newTask.attachments.length > 0 && (
          <div className="attachments-preview">
            <h4>Attached Files:</h4>
            <div className="attachment-tags">
              {newTask.attachments.map((file, index) => (
                <div key={index} className="attachment-tag">
                  <span>{file.name}</span>
                  <button 
                    type="button" 
                    onClick={() => removeAttachment(index)}
                    className="remove-attachment"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default TaskForm; 