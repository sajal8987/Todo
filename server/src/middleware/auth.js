const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const User = require('../models/User');
const config = require('../config');

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const payload = jwt.verify(token, config.jwtSecret);
    const { jti, sub: userId } = payload;

    const session = await Session.findOne({ jti, user: userId });
    if (!session || session.revoked) {
      return res.status(401).json({ message: 'Session invalid' });
    }

    const now = new Date();
    if (session.expiresAt <= now) {
      return res.status(401).json({ message: 'Session expired' });
    }

    const inactiveMs = now - session.lastActivity;
    const maxInactiveMs = config.inactivityMinutes * 60 * 1000;
    if (inactiveMs > maxInactiveMs) {
      session.revoked = true;
      await session.save();
      return res.status(401).json({ message: 'Session timed out due to inactivity' });
    }

    // refresh last activity on each authenticated request
    session.lastActivity = now;
    await session.save();

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User no longer exists' });

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

module.exports = authMiddleware;
