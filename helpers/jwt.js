const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const signToken = (payload) => {
  const { id, email, username } = payload;
  return jwt.sign({ id, email, username }, JWT_SECRET_KEY);
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

module.exports = {
  signToken,
  verifyToken,
};
