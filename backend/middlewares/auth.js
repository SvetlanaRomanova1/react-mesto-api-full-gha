const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);

    return next();
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};
