const PaymentModel = require('../../models/paymentModel/paymentModel');

class PaymentController {
  static async handleTokenMidtrans(req, res, next) {
    try {
      PaymentModel.midtransToken();
      res.status(200).json({ message: 'Token midtrans here' });
    } catch (err) {
      next(err);
    }
  }

  static async handleUpdateBalance(req, res, next) {
    try {
      res.status(200).json({ message: 'Update balance Succes' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
