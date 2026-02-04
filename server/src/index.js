const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

async function start() {
  await mongoose.connect(config.mongoUri);
  const app = express();

  app.use(cors({ origin: config.clientUrl, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/todos', todoRoutes);

  // Global error handler (fallback)
  app.use((err, req, res, next) => {
    console.error('Unhandled error', err);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

start().catch((e) => {
  console.error('Failed to start server', e);
  process.exit(1);
});
