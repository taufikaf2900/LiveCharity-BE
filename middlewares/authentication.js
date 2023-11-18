const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

const authentication = async (req, res, next) => {
  try {
    const payload = verifyToken(req.headers.access_token);

    const user = await User.findByPk(payload.id);
    if (!user) throw { status: 401, error: 'unauthenticated' };

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;
