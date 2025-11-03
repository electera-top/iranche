const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Token required' });
  }
  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.admin = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
  }
}

module.exports = { authenticateJWT };


