const { User } = require('../../models');
const { signToken } = require('../../helpers/jwt');
const { comparePassword } = require('../../helpers/bcryptjs');

class UserController {
  static async handleLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) throw { status: 400, error: 'Email required' };

      if (!password) throw { status: 400, error: 'Password required' };

      const user = await User.findOne({ where: { email } });
      if (!user || !comparePassword(password, user.password)) {
        throw { status: 401, error: 'Invalid email/password' };
      }

      const access_token = signToken({ id: user.id });
      res.json({ access_token, username: user.username, id: user.id });
    } catch (err) {
      next(err);
    }
  }

  static async handleRegister(req, res, next) {
    try {
      await User.create(req.body);
      res.status(201).json({ message: 'Register success' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
