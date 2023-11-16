const router = require('express').Router();
const LivestreamController = require('../../controllers/paymentControllers/paymentController');

router.get('/:livestreamId/status', LivestreamController.handleStatusLivestream);
router.put('/:livestreamId/status', LivestreamController.handleUpdateStatusLivestream);

module.exports = router;
