const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const ERROR_CODE_UNAUTHORIZED = 401;

const errorResponse = (message) => ({ message });

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(ERROR_CODE_UNAUTHORIZED).send(errorResponse('Необходима авторизация'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    return next();
  } catch (err) {
    return res.status(ERROR_CODE_UNAUTHORIZED).send(errorResponse('Необходима авторизация'));
  }
};
