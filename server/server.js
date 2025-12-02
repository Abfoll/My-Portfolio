// Compatibility wrapper so Vercel deployments with Project Root = `server`
// can load a valid serverless handler at `/server/server.js`.

const serverless = require('serverless-http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Import the refactored app utilities from repository root `server.js`
const { createApp, ensureAdminUser } = require('../server');

function sanitizeMongoUri(uri) {
  let sanitized = uri.trim();
  sanitized = sanitized.replace(/<([^>]+)>/g, '$1');
  if (sanitized.startsWith('mongodb+srv://')) {
    const prefix = 'mongodb+srv://';
    const rest = sanitized.slice(prefix.length);
    const slashIdx = rest.indexOf('/');
    const qIdx = rest.indexOf('?');
    let endIdx;
    if (slashIdx === -1 && qIdx === -1) endIdx = rest.length;
    else if (slashIdx === -1) endIdx = qIdx;
    else if (qIdx === -1) endIdx = slashIdx;
    else endIdx = Math.min(slashIdx, qIdx);
    const authAndHosts = rest.slice(0, endIdx);
    const suffix = rest.slice(endIdx);
    const atIdx = authAndHosts.lastIndexOf('@');
    let authPart = '';
    let hostsPart = authAndHosts;
    if (atIdx !== -1) {
      authPart = authAndHosts.slice(0, atIdx + 1);
      hostsPart = authAndHosts.slice(atIdx + 1);
    }
    const cleanedHosts = hostsPart.replace(/:\d+/g, '');
    if (cleanedHosts !== hostsPart) {
      sanitized = prefix + authPart + cleanedHosts + suffix;
      console.warn('Adjusted mongodb+srv URI to remove invalid port number(s).');
    }
    if (authPart) {
      const authRaw = authPart.slice(0, -1);
      const colonIdx = authRaw.indexOf(':');
      if (colonIdx !== -1) {
        let username = authRaw.slice(0, colonIdx);
        let password = authRaw.slice(colonIdx + 1);
        const alreadyEncoded = /%[0-9A-Fa-f]{2}/.test(username) || /%[0-9A-Fa-f]{2}/.test(password);
        const safeRe = /^[A-Za-z0-9\-._~!$&'()*+,;=:\\]+$/;
        if (!alreadyEncoded && (!safeRe.test(username) || !safeRe.test(password))) {
          const enc = (s) => encodeURIComponent(s);
          username = enc(username);
          password = enc(password);
          const newAuth = `${username}:${password}@`;
          sanitized = prefix + newAuth + cleanedHosts + suffix;
          console.warn('Credentials were URL-encoded automatically to form a valid MongoDB URI.');
        }
      }
    }
  }
  return sanitized;
}

const cached = global.__mongoCache || (global.__mongoCache = { conn: null, promise: null });

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  if (!cached.promise) {
    const uri = sanitizeMongoUri(process.env.MONGODB_URI);
    cached.promise = mongoose.connect(uri).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const app = createApp();
const handler = serverless(app);

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    try { ensureAdminUser(); } catch (e) { console.warn('ensureAdminUser failed:', e && e.message); }
    return handler(req, res);
  } catch (err) {
    console.error('Serverless function error:', err && err.stack ? err.stack : err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');

// Build and return an Express app without starting the server or connecting to Mongo.
// This allows the same app to be used in both a traditional server (`server/index.js`)
// and in serverless environments (via `api/server.js`).
const createApp = () => {
  const app = express();

  // Middleware
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.use(cors({ origin: corsOrigin }));
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