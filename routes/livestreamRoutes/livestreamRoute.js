const router = require('express').Router();
const LivestreamController = require('../../controllers/livestreamControllers/livestreamController');
const authentication = require('../../middlewares/authentication');

router.patch('/:livestreamId/status', LivestreamController.handleUpdateStatusLivestream);
router.post('/donate', authentication, LivestreamController.handleLivestreamDonate);
module.exports = router;
