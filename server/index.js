require('dotenv').config();
const mongoose = require('mongoose');
const { createApp, ensureAdminUser } = require('./server');

// Connect to MongoDB and start the Express server (traditional runtime)
let mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Missing MONGODB_URI environment variable. Set it in `server/.env`.');
  process.exit(1);
}

let sanitized = mongoUri.trim();
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

mongoose.connect(sanitized)
  .then(() => {
    console.log('Connected to MongoDB');
    ensureAdminUser();
    const app = createApp();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    process.exit(1);
  });
