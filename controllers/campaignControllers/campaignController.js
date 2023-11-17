class CampaignController {
  static async handleCampaign(req, res, next) {
    try {
      res.status(200).json({ message: 'Campaign' });
    } catch (err) {
      next(err);
    }
  }

  static async handleCampaignDetail(req, res, next) {
    try {
      res.status(200).json({ message: 'Campaign detail' });
    } catch (err) {
      next(err);
    }
  }

  static async handleCampaignAdd(req, res, next) {
    try {
      res.status(200).json({ message: 'Campaign add' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CampaignController;
