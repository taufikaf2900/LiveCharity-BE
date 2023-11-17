const PaymentModel = require('../../models/paymentModel/paymentModel');

class PaymentController {
  static async handleTokenMidtrans(req, res, next) {
    try {
      const token = await PaymentModel.midtransToken();
      res.status(200).json({ midtrans_token: token });
    } catch (err) {
      next(err);
    }
  }

  static async handleUpdateBalance(req, res, next) {
    try {
      console.log(req.body);
      res.status(200).json({ message: 'Update balance Succes' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
