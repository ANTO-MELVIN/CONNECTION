const jwt = require('jsonwebtoken');
const config = require('../config/env');
const prisma = require('../lib/prisma');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { ownerProfile: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token subject' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
  };
}

module.exports = {
  authenticate,
  authorizeRoles,
};
