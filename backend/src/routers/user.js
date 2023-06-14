const express = require('express');
const Users = require('../models/users');
const { verifyToken } = require('../auth/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users');
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user');
    res.status(500).json({ error: 'Error fetching user' });
  }
});

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('req.body: ', req.body);
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const newUser = new Users({
      name,
      email,
      password,
    });

    await newUser.save();

    return res.status(200).json(newUser);
  } catch (error) {
    console.error('Error creating new user');
    return res.status(500).json({ error: 'Error creating new user' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await Users.findByIdAndUpdate(id, { name, email }, { new: true });

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error to update user:');
    res.status(500).json({ error: 'Error to update user' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  console.log('req.params: ', req.params);
  try {
    const { id } = req.params;
    console.log('id: ', id);
    const deletedUser = await Users.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
    }
    res.json(deletedUser);
  } catch (error) {
    console.error('Error to delete user:');
    res.status(500).json({ error: 'Error to delete user' });
  }
});

module.exports = router;
