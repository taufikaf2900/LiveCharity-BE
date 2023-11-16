module.exports = {
  async handleTokenMidtrans(req, res, next) {
    try {
      res.status(200).json({ message: 'Token midtrans here' });
    } catch (err) {
      next(err);
    }
  },

  async handleUpdateBalance(req, res, next) {
    try {
      res.status(200).json({ message: 'Update balance Succes' });
    } catch (err) {
      next(err);
    }
  },
};
