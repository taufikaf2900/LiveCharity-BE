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
      const response = await cloudinary.uploader.upload(req?.file?.path, (err, result) => {
        if(err) {
          console.log(err);
        } else {
          return result;
        }
      })

      const { title, targetFunds, expireDate, description, categoryId } = req.body;
        const data = await Livestream.create({
          title,
          targetFunds,
          thumbnail: response.secure_url,
          expireDate,
          description,
          UserId: req.user.id,
          roomId: uuidv4(),
          CategoryId: categoryId
        });
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      if(!req.file) {
        next({ status: 400, error: 'Please insert thumbnail'})
      } else {
        next(err);
      }
    }
  }
}

module.exports = CampaignController;
