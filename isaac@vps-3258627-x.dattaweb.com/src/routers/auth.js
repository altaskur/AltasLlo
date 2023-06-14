const express = require('express');

const router = express.Router();
const User = require('../models/users');
const { generateToken } = require('../auth/auth');

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

    return res.json({ token });
  } catch (error) {
    console.error('Error during login');
    return res.status(500).json({ error: 'Error during login' });
  }
});

module.exports = router;
