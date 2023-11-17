
 const {Livestream, User, Donation} = require("../../models")
 const { v4: uuidv4 } = require('uuid');

class CampaignController {

  static async handleCampaign(req, res, next) {
    try {
      const data = await Livestream.findAll({
        order: [['id', 'DESC']]
      })
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({message : "Internal Server Error"})
      // next(err);
    }
  }

  static async handleCampaignDetail(req, res, next) {
    try {
      const { livestreamId } = req.params
      const data = await Livestream.findByPk(livestreamId, {
        include : [
          {
            model : Donation,
            include : {
              model : User,
              attributes : ["id", "username"]
            },
          }, 
          {
            model : User,
            attributes : ["id", "username"]
          }
        ],
      })
      res.status(200).json(data);
    } catch (err) {
      // console.log(err)
      res.status(500).json({message : "Internal Server Error"})
      // next(err);
    }
  }

  static async handleCampaignAdd(req, res, next) {
    try {
      const {title,targetFunds,thumbnail,expireDate, description} = req.body
      const data = await Livestream.create({title,targetFunds,thumbnail,expireDate, description, UserId : req.user.id,roomId:uuidv4()})
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({message : "Internal Server Error"})
      // next(err);
    }
  }
}

module.exports = CampaignController;
