const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const config = require('../config/env');

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { ownerProfile: true },
  });

  if (!user) {
    throw createAuthError('Invalid credentials');
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw createAuthError('Invalid credentials');
  }

  const accessToken = jwt.sign({
    sub: user.id,
    role: user.role,
  }, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });

  const refreshToken = jwt.sign({
    sub: user.id,
  }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });

  return { user, accessToken, refreshToken };
}

async function registerOwner(payload) {
  const existing = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });
  if (existing) {
    throw createAuthError('Email already registered');
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email.toLowerCase(),
        passwordHash,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone || null,
        role: 'OWNER',
      },
    });

    const ownerProfile = await tx.ownerProfile.create({
      data: {
        userId: user.id,
        companyName: payload.companyName,
        gstNumber: payload.gstNumber || null,
        address: payload.address || null,
      },
    });

    return { user, ownerProfile };
  });

  return result;
}

function createAuthError(message) {
  const error = new Error(message);
  error.status = 401;
  return error;
}

module.exports = {
  login,
  registerOwner,
};
