const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');

const app = express();

// Middleware
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// Connect to MongoDB
let mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Missing MONGODB_URI environment variable. Set it in `server/.env`.');
  process.exit(1);
}

// Sanitize common user mistakes and handle mongodb+srv specifics:
let sanitized = mongoUri.trim();
// remove angle-bracket wrappers like <user> or <pass>
sanitized = sanitized.replace(/<([^>]+)>/g, '$1');

if (sanitized.startsWith('mongodb+srv://')) {
  const prefix = 'mongodb+srv://';
  const rest = sanitized.slice(prefix.length);
  // determine end of authority (before first / or ?)
  const slashIdx = rest.indexOf('/');
  const qIdx = rest.indexOf('?');
  let endIdx;
  if (slashIdx === -1 && qIdx === -1) endIdx = rest.length;
  else if (slashIdx === -1) endIdx = qIdx;
  else if (qIdx === -1) endIdx = slashIdx;
  else endIdx = Math.min(slashIdx, qIdx);

  const authAndHosts = rest.slice(0, endIdx); // may be auth@hosts or just hosts
  const suffix = rest.slice(endIdx); // includes leading / or ? or is empty

  const atIdx = authAndHosts.lastIndexOf('@');
  let authPart = '';
  let hostsPart = authAndHosts;
  if (atIdx !== -1) {
    authPart = authAndHosts.slice(0, atIdx + 1); // includes trailing @
    hostsPart = authAndHosts.slice(atIdx + 1);
  }

  // Remove any :<digits> occurrences from the hosts part (e.g. host:27017 or host1:27017,host2:27017)
  const cleanedHosts = hostsPart.replace(/:\d+/g, '');
  if (cleanedHosts !== hostsPart) {
    sanitized = prefix + authPart + cleanedHosts + suffix;
    console.warn('Adjusted mongodb+srv URI to remove invalid port number(s).');
  }

  // If credentials exist, warn if they contain characters that should be URL-encoded
  if (authPart) {
    const authRaw = authPart.slice(0, -1); // remove trailing @
    const colonIdx = authRaw.indexOf(':');
    if (colonIdx !== -1) {
      let username = authRaw.slice(0, colonIdx);
      let password = authRaw.slice(colonIdx + 1);

      // If username/password already contain percent-encoding (%xx), assume encoded and skip
      const alreadyEncoded = /%[0-9A-Fa-f]{2}/.test(username) || /%[0-9A-Fa-f]{2}/.test(password);

      // Characters that are safe unencoded in userinfo per RFC are: A-Z a-z 0-9 -._~!$&'()*+,;=:
      // We'll encode conservatively: if any char outside a safe set appears and not already encoded, encode both
      const safeRe = /^[A-Za-z0-9\-._~!$&'()*+,;=:\\]+$/;
      if (!alreadyEncoded && (!safeRe.test(username) || !safeRe.test(password))) {
        const enc = (s) => encodeURIComponent(s);
        username = enc(username);
        password = enc(password);
        // Rebuild authPart and sanitized URI
        const newAuth = `${username}:${password}@`;
        sanitized = prefix + newAuth + cleanedHosts + suffix;
        console.warn('Credentials were URL-encoded automatically to form a valid MongoDB URI.');
      }
    }
  }
}

mongoose.connect(sanitized, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Ensure JWT secret exists (dev fallback) and an admin user exists (use env vars when provided)
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
  console.warn('JWT_SECRET not set. Using development fallback. Set JWT_SECRET in environment for production.');
}

// Ensure an admin user exists (use env vars when provided)
const ensureAdminUser = async () => {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    const adminEmail = process.env.ADMIN_EMAIL || 'abenezerteketel7@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '#Ab02Tk..';

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      // Check password; if different, update it
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

// Run admin ensure after mongoose connected (best-effort)
mongoose.connection.once('connected', () => {
  ensureAdminUser();
});

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