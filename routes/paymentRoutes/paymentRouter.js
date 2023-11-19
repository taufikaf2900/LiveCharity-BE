const router = require('express').Router();
const PaymentController = require('../../controllers/paymentControllers/paymentController');
const authentication = require('../../middlewares/authentication');
router.post('/get-token-midtrans', authentication, PaymentController.handleTokenMidtrans);
router.post('/balance', PaymentController.handleUpdateBalance);

module.exports = router;
