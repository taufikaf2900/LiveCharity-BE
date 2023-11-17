const PaymentModel = require('../../models/paymentModel/paymentModel');
const { PaymentHistory } = require('../../models');

class PaymentController {
  static async handleTokenMidtrans(req, res, next) {
    try {
      console.log(req.headers.access_token);
      const token = await PaymentModel.midtransToken(req.user);
      res.status(200).json({ midtrans_token: token });
    } catch (err) {
      next(err);
    }
  }

  static async handleUpdateBalance(req, res, next) {
    try {
      const { order_id, transaction_status } = req.body;
      if (transaction_status === 'capture') {
        await PaymentHistory.update({ statusPayment: true }, { where: { UserId: 1, orderId: order_id } });
        res.status(200).json({ message: 'Update balance Succes' });
      } else {
        res.status(200).json({ message: 'Update balance failed' });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
