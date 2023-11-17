class LivestreamController {
  static async handleStatusLivestream(req, res, next) {
    try {
      res.status(200).json({ message: 'This status livestream' });
    } catch (err) {
      next(err);
    }
  }

  static async handleUpdateStatusLivestream(req, res, next) {
    try {
      res.status(200).json({ message: 'Update status livestream' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LivestreamController;
