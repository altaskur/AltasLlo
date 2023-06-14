const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateToken(user) {
  const payload = {
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  return token;
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function generateHash(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function comparePassword(password, hash) {
  const match = await bcrypt.compare(password, hash);
  return match;
}

module.exports = {
  generateToken,
  verifyToken,
  generateHash,
  comparePassword,
};
