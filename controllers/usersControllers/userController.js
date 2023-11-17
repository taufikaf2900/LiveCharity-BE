const { User, Wallet } = require('../../models');
const { signToken } = require('../../helpers/jwt');
const { comparePassword } = require('../../helpers/bcryptjs');

class UserController {
  static async handleLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) throw { status: 400, error: 'Email is required' };

      if (!password) throw { status: 400, error: 'Password is required' };

      const user = await User.findOne({ where: { email } });
      if (!user || !comparePassword(password, user.password)) {
        throw { status: 401, error: 'Invalid email/password' };
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token, username: user.username, id: user.id });
    } catch (err) {
      next(err);
    }
  }

  static async handleRegister(req, res, next) {
    try {
      const user = await User.create(req.body);
      await Wallet.create({ UserId: user.id });
      await res.status(201).json({ message: 'Register success' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
