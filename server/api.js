// Serverless wrapper for when Vercel is configured with the project root = `server`.
// This mirrors `api/server.js` but uses local paths so Vercel will find a default
// export when deploying from the `server` folder.

const serverless = require('serverless-http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { createApp, ensureAdminUser } = require('./server');

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set in environment for serverless function.');
}

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
