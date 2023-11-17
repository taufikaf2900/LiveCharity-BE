const router = require('express').Router();
const PaymentController = require('../../controllers/paymentControllers/paymentController');

router.get('/get-token-midtrans', PaymentController.handleTokenMidtrans);
router.post('/balance', PaymentController.handleUpdateBalance);

module.exports = router;
