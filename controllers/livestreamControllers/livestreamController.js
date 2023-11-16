module.exports = {
  async handlehandleStatusLivestream(req, res, next) {
    try {
      res.status(200).json({ message: 'This status livestream' });
    } catch (err) {
      next(err);
    }
  },

  async handleUpdateStatusLivestream(req, res, next) {
    try {
      res.status(200).json({ message: 'Update status livestream' });
    } catch (err) {
      next(err);
    }
  },
};
