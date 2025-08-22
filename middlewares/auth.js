const jwt = require('jsonwebtoken');
function isAuthenticated(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      error: 'Un-Authorized',
      message: '🚫 Un-Authorized 🚫'
    });
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.payload = payload;
  } catch (err) {
    console.error("Token verification failed:", err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'TokenExpiredError',
        message: 'Token has expired'
      });
    }
    return res.status(401).json({
      error: 'Un-Authorized',
      message: '🚫 Un-Authorized 🚫'
    });
  }

  return next();
}

module.exports = {
    // ... other modules
    isAuthenticated
}