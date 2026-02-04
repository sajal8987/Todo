const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const config = require('../config');
const auth = require('../middleware/auth');

const router = express.Router();

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'lax',
    maxAge: config.sessionTtlHours * 60 * 60 * 1000,
    path: '/',
  });
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), passwordHash, name });
    return res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const jti = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + config.sessionTtlHours * 60 * 60 * 1000);

    await Session.create({ jti, user: user._id, lastActivity: now, expiresAt, revoked: false });

    const token = jwt.sign({ jti, sub: String(user._id) }, config.jwtSecret, { expiresIn: `${config.sessionTtlHours}h` });
    setAuthCookie(res, token);

    return res.json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    if (req.session) {
      req.session.revoked = true;
      await req.session.save();
    }
  } catch (e) {}
  res.clearCookie('token', { path: '/' });
  return res.json({ message: 'Logged out' });
});

router.get('/me', auth, async (req, res) => {
  return res.json({ user: { id: req.user._id, email: req.user.email, name: req.user.name } });
});

module.exports = router;
