const router = require('express').Router();
const CampaignController = require('../../controllers/campaignControllers/campaignController');
const authentication = require('../../middlewares/authentication');
const upload = require('../../middlewares/multer');

router.get('/', CampaignController.handleCampaign);
router.get('/pagenation', CampaignController.handleCampaignPagenation);
router.get('/pagenation/users', authentication, CampaignController.handleCampaignPagenationUser);
router.get('/:livestreamId', CampaignController.handleCampaignDetail);
router.post('/', [authentication, upload.single('image')], CampaignController.handleCampaignAdd);
module.exports = router;
