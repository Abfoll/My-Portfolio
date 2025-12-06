const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');

// Build and return an Express app without starting the server or connecting to Mongo.
const createApp = () => {
  const app = express();

  // Middleware
  // Allow single or comma-separated origins (e.g., "https://foo.com,https://bar.com")
  const corsOriginEnv = process.env.CORS_ORIGIN || '*';
  const allowedOrigins = corsOriginEnv.split(',').map(o => o.trim()).filter(Boolean);
  app.use(cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow non-browser or same-origin
      if (allowedOrigins.includes('*')) return cb(null, true);
      return allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error('CORS blocked: origin not allowed'));
    },
    credentials: true
  }));
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/contact', contactRoutes);

  // Generic express error handler
  app.use((err, req, res, next) => {
    console.error('Express error:', err && err.stack ? err.stack : err);
    if (res.headersSent) return next(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection at:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    process.exit(1);
  });

  return app;
};

// Helper to ensure an admin user exists. Call after mongoose connection is established.
const ensureAdminUser = async () => {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    const adminEmail = process.env.ADMIN_EMAIL || 'abenezerteketel7@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '#Ab02Tk..';

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      const match = await bcrypt.compare(adminPassword, existing.password);
      if (!match) {
        const hashed = await bcrypt.hash(adminPassword, 12);
        existing.password = hashed;
        await existing.save();
        console.log('Admin user password updated to provided ADMIN_PASSWORD.');
      } else {
        console.log('Admin user exists and password matches provided value.');
      }
    } else {
      const hashed = await bcrypt.hash(adminPassword, 12);
      const newAdmin = new User({ email: adminEmail, password: hashed });
      await newAdmin.save();
      console.log('Admin user created with provided ADMIN_EMAIL.');
    }
  } catch (err) {
    console.warn('Could not ensure admin user:', err && err.message ? err.message : err);
  }
};

module.exports = { createApp, ensureAdminUser };
