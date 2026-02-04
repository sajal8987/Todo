const dotenv = require('dotenv');
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cookieSecure: String(process.env.COOKIE_SECURE).toLowerCase() === 'true',
  inactivityMinutes: parseInt(process.env.SESSION_INACTIVITY_MINUTES || '30', 10),
  sessionTtlHours: parseInt(process.env.SESSION_TTL_HOURS || '24', 10)
};

if (!config.mongoUri) throw new Error('MONGODB_URI is required');
if (!config.jwtSecret) throw new Error('JWT_SECRET is required');

module.exports = config;
