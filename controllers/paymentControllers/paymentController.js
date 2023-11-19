const PaymentModel = require('../../models/paymentModel/paymentModel');
const { PaymentHistory, Wallet } = require('../../models');

class PaymentController {
  static async handleTokenMidtrans(req, res, next) {
    try {
      const token = await PaymentModel.midtransToken(req.user, req.body);
      console.log(req.user);

      res.status(200).json({ midtrans_token: token });
    } catch (err) {
      next(err);
    }
  }

  static async handleUpdateBalance(req, res, next) {
    try {
      const { order_id, transaction_status, gross_amount } = req.body;
      if (transaction_status === 'capture') {
        const history = await PaymentHistory.findOne({ where: { orderId: order_id } });

        await PaymentHistory.update({ statusPayment: true }, { where: { UserId: history.UserId, orderId: order_id } });

        await Wallet.increment({ balance: +gross_amount }, { where: { UserId: history.UserId } });

        return res.status(200).json({ message: 'Update balance Succes' });
      }
      return res.status(400).json({ message: 'Update balance failed' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
