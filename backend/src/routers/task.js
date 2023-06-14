const express = require('express');

const router = express.Router();
const Task = require('../models/tasks');
const { verifyToken } = require('../auth/auth');

router.get('/:projectId', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks');
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task');
    res.status(500).json({ error: 'Error fetching task' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    console.log("req: ",req.body)
    const task = await Task.create(req.body);
    res.status(200).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

router.delete('/:id',verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(200).json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

module.exports = router;
