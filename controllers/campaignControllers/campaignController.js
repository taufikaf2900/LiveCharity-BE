const { Livestream, User, Donation, Category } = require('../../models');
const { v4: uuidv4 } = require('uuid');

class CampaignController {
  static async handleCampaign(req, res, next) {
    try {
      const data = await Category.findAll({
        include: [{ model: Livestream }],
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async handleCampaignDetail(req, res, next) {
    try {
      const { livestreamId } = req.params;
      const livestream = await Livestream.findByPk(livestreamId, {
        include: [
          {
            model: Donation,
            include: {
              model: User,
              attributes: ['id', 'username'],
            },
          },
          {
            model: User,
            attributes: ['id', 'username'],
          },
        ],
      });

      if (!livestream) throw { status: 404, error: 'Campaign is not found' };

      res.status(200).json(livestream);
    } catch (err) {
      next(err);
    }
  }

  static async handleCampaignAdd(req, res, next) {
    try {
      const { title, targetFunds, thumbnail, expireDate, description } = req.body;
      const data = await Livestream.create({
        title,
        targetFunds,
        thumbnail,
        expireDate,
        description,
        UserId: req.user.id,
        roomId: uuidv4(),
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CampaignController;
