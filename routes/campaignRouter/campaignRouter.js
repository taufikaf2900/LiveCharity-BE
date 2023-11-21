const router = require('express').Router();
const CampaignController = require('../../controllers/campaignControllers/campaignController');
const authentication = require('../../middlewares/authentication');

router.get('/', CampaignController.handleCampaign);
router.get('/pagenation', CampaignController.handleCampaignPagenation);
router.get('/pagenation/users', authentication, CampaignController.handleCampaignPagenationUser);
router.get('/:livestreamId', CampaignController.handleCampaignDetail);
router.post('/', authentication, CampaignController.handleCampaignAdd);
module.exports = router;
