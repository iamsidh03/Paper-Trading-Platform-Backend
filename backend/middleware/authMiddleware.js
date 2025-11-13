// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const prisma = require('../config/db'); // it's okay if this exports Prisma client or helper

const protect = async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // decoded must have id
      req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!req.user) return res.status(401).json({ error: 'User no longer exists' });
      return next();
    }
    return res.status(401).json({ error: 'No token provided' });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Not authorized' });
  }
};

module.exports = { protect };
