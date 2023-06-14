const express = require('express');

const router = express.Router();
const Project = require('../models/projects');

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects');
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project');
    res.status(500).json({ error: 'Error fetching project' });
  }
});

router.post('/', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(200).json(project);
  } catch (error) {
    console.error('Error creating project');
    res.status(500).json({ error: 'Error creating project' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProject) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project');
    res.status(500).json({ error: 'Error updating project' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(deletedProject);
  } catch (error) {
    console.error('Error deleting project');
    return res.status(500).json({ error: 'Error deleting project' });
  }
});

module.exports = router;
