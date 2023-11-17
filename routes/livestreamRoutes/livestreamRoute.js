const router = require('express').Router();
const LivestreamController = require('../../controllers/livestreamControllers/livestreamController');

router.patch('/:livestreamId/status', LivestreamController.handleUpdateStatusLivestream);

module.exports = router;
