const router = require('express').Router();
const errorHandler = require('../middlewares/errorHandler');

router.use('/users', require('./usersRoutes/userRouter'));
router.use('/payment', require('./paymentRoutes/paymentRouter'));
router.use('/livestream', require('./livestreamRoutes/livestreamRoute'));
router.use('/campaign', require('./campaignRouter/campaignRouter'));

router.use(errorHandler);

module.exports = router;
