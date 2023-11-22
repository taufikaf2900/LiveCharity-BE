const { Livestream, User, Donation, Category } = require('../../models');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('../../config/cloudinary');
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

  static async handleCampaignPagenation(req, res, next) {
    try {
      const { page, search } = req.query;
      let pages = Number(page) ? +page : 1;
      let options = { limit: 9, offset: (pages - 1) * 9, include: ['Category'], order: [['id', 'DESC']] };

      if (search) {
        options.where = { CategoryId: search.split(',') };
      }

      const pagenation = await Livestream.findAndCountAll(options);
      res.status(200).json(pagenation);
    } catch (err) {
      next(err);
    }
  }

  static async handleCampaignPagenationUser(req, res, next) {
    try {
      const { page, search } = req.query;
      let pages = Number(page) ? +page : 1;
      let options = { limit: 9, offset: (pages - 1) * 9, include: ['Category'], where: { UserId: req.user.id }, order: [['id', 'DESC']] };

      if (search) {
        options.where = { CategoryId: search.split(','), UserId: req.user.id };
      }

      const pagenation = await Livestream.findAndCountAll(options);
      res.status(200).json(pagenation);
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
      const { title, targetFunds, expireDate, description, categoryId } = req.body;
      const response = await cloudinary.uploader.upload(req?.file?.path);
      const data = await Livestream.create({
        title,
        targetFunds,
        thumbnail: response.secure_url,
        expireDate,
        description,
        UserId: req.user.id,
        roomId: uuidv4(),
        CategoryId: categoryId,
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CampaignController;
