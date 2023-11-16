const router = require('express').Router();
const CampaignController = require('../../controllers/campaignControllers/campaignController');

router.get('/', CampaignController.handleCampaign);
router.post('/', CampaignController.handleCampaignAdd);
router.get('/:livestreamId', CampaignController.handleCampaignDetail);

module.exports = router;
