
const { Livestream } = require('../../models');

class LivestreamController{

  static async handleUpdateStatusLivestream(req, res, next) {
    try {
      const { livestreamId } = req.params;

      const livestream = await Livestream.findByPk(livestreamId);

      if(!livestream) throw { status: 404, error: 'Livestream is not found' }

      await Livestream.update({ statusLive: !livestream.status }, {
        where: { id: livestreamId }
      });
      res.status(200).json({ message: 'Update status livestream' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LivestreamController;
