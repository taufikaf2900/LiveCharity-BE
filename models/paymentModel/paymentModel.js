const midtransClient = require('midtrans-client');
const { PaymentHistory } = require('../../models');

module.exports = {
  async midtransToken(user, amount) {
    try {
      const { id: UserId, email, username } = user;
      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.APIKEY_SERVER_MIDTRANS,
      });
      const orderId = 'ORDERID-' + new Date().getTime();
      await PaymentHistory.create({ UserId, orderId });

      let parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: amount.amount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          username,
          email,
        },
      };

      const token = snap.createTransaction(parameter).then((transaction) => {
        let transactionToken = transaction.token;
        return transactionToken;
      });
      console.log(await token, '<========================');
      return token;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
