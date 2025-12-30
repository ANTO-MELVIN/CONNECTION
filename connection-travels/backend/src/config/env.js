const dotenv = require('dotenv');

const result = dotenv.config();

if (result.error && process.env.NODE_ENV !== 'production') {
  console.warn('Warning: .env file not found, falling back to process env variables');
}

const parseOrigins = (value) => {
  if (!value) return [];
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const parsedCorsOrigins = parseOrigins(process.env.CORS_ORIGINS);

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  jwt: {
    accessSecret: process.env.JWT_SECRET || 'change-me',
    refreshSecret: process.env.REFRESH_SECRET || 'change-me-too',
    accessExpiresIn: '30m',
    refreshExpiresIn: '7d',
  },
  corsOrigins: parsedCorsOrigins.length > 0 ? parsedCorsOrigins : [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ],
};

module.exports = config;
