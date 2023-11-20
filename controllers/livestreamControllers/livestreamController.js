const { Livestream, Wallet, Donation } = require('../../models');

class LivestreamController {
  static async handleUpdateStatusLivestream(req, res, next) {
    try {
      const { livestreamId } = req.params;

      const livestream = await Livestream.findByPk(livestreamId);

      if (!livestream) throw { status: 404, error: 'Livestream is not found' };

      await Livestream.update({ statusLive: !livestream.statusLive }, { where: { id: livestreamId } });

      res.status(200).json({ message: 'Update status livestream' });
    } catch (err) {
      next(err);
    }
  }

  static async handleLivestreamDonate(req, res, next) {
    try {
      const { livestreamId: LivestreamId, amount, comment } = req.body;
      const { id: UserId } = req.user;
      const checkBalance = await Wallet.findOne({ where: { UserId } });
      if (checkBalance.balance >= amount) {
        await Wallet.decrement({ balance: amount }, { where: { UserId } });


        await Livestream.increment({ currentFunds: amount }, { where: { id: LivestreamId } });

        await Donation.create({ LivestreamId, UserId, amount, comment });
        await Livestream.increment({ currentFunds: amount }, { where: { id: LivestreamId } })
        
        res.status(200).json({ message: 'Success donate' });
      } else {
        throw { status: 400, error: 'Failed donate' };
      }
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }
}

module.exports = LivestreamController;
