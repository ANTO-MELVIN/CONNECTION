const authService = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      user: sanitizeUser(result.user),
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

async function registerOwner(req, res, next) {
  try {
    const result = await authService.registerOwner(req.body);
    res.status(201).json({
      user: sanitizeUser(result.user),
      ownerProfile: result.ownerProfile,
    });
  } catch (error) {
    next(error);
  }
}

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

module.exports = {
  login,
  registerOwner,
};
