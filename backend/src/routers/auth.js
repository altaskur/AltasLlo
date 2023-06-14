const express = require('express');

const router = express.Router();
const User = require('../models/users');
const { generateToken, verifyToken } = require('../auth/auth');

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('email', email);
    console.log('password', password);
    const user = await User.findOne({ email });
    console.log('user', user);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login');
    return res.status(500).json({ error: 'Error during login' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Error fetching user' });
  }
});
module.exports = router;
