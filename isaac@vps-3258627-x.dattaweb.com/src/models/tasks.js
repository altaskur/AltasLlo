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
  color: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'done'],
    default: 'todo',
  },
  tags: {
    type: [String],
    default: [],
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  collection: 'tasks',
  database: 'altasLlo',
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
