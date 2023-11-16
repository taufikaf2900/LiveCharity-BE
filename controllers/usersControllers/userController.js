module.exports = {
  async handleLogin(req, res, next) {
    try {
      res.status(200).json({ message: 'Success login user' });
    } catch (err) {
      next(err);
    }
  },

  async handleRegister(req, res, next) {
    try {
      res.status(201).json({ message: 'Success register user' });
    } catch (err) {
      next(err);
    }
  },
};
