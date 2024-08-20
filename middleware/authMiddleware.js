const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/api/user/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/api/user/login');
  }
}

function isNotAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect('/');
  } catch (err) {
    res.clearCookie('token');
    return next();
  }
}

module.exports = {
  isAuthenticated,
  isNotAuthenticated
};