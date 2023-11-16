module.exports = {
  async handleCampaign(req, res, next) {
    try {
      res.status(200).json({ message: 'Campaign' });
    } catch (err) {
      next(err);
    }
  },

  async handleCampaignDetail(req, res, next) {
    try {
      res.status(200).json({ message: 'Campaign detail' });
    } catch (err) {
      next(err);
    }
  },

  async handleCampaignAdd(req, res, next) {
    try {
      res.status(200).json({ message: 'Campaign add' });
    } catch (err) {
      next(err);
    }
  },
};
