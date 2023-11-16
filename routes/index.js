const router = require('express').Router();
const errorHandler = require('../middlewares/errorHandler');

router.use('/users', require('./usersRoutes/userRouter'));
router.use('/payment', require('./paymentRoutes/paymentRouter'));
router.use(errorHandler);

module.exports = router;
