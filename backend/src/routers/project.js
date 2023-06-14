const express = require('express');
const { verifyToken } = require('../auth/auth');
const router = express.Router();
const Project = require('../models/projects');

router.get('/',verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects');
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

router.get('/:id',verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project');
    res.status(500).json({ error: 'Error fetching project' });
  }
});

router.post('/',verifyToken, async (req, res) => {
  console.log('req.body: ', req.body);
  try {
    const { name, description } = req.body;
    const userId = req.user.id; // Obtiene la ID del usuario desde req.user

    const project = await Project.create({
      name,
      description,
      user: userId,
    });

    res.status(200).json(project);
  } catch (error) {
    console.error('Error creating project');
    res.status(500).json({ error: 'Error creating project' });
  }
});

router.put('/:id',verifyToken, async (req, res) => {
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

router.delete('/:id', verifyToken,async (req, res) => {
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
