const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  column: {
    type: String,
    required: true,
    enum: ['todo', 'inProgress', 'done'],
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
  },
  category: {
    type: String,
    required: true,
    enum: ['bug', 'feature', 'enhancement'],
  },
  attachment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', taskSchema); 