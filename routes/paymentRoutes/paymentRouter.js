const router = require('express').Router();
const PaymentController = require('../../controllers/paymentControllers/paymentController');

router.get('/get-token-midtrans', PaymentController.handleTokenMidtrans);
router.patch('/balance', PaymentController.handleUpdateBalance);

module.exports = router;
