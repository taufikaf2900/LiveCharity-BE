const midtransClient = require('midtrans-client');

module.exports = {
  async midtransToken() {
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.APIKEY_SERVER_MIDTRANS,
    });

    let parameter = {
      transaction_details: {
        order_id: 'ORDERID-2525',
        gross_amount: 10000,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: 'budi',
        last_name: 'pratama',
        email: 'budi.pra@example.com',
        phone: '08111222333',
      },
    };

    const token = snap.createTransaction(parameter).then((transaction) => {
      let transactionToken = transaction.token;
      return transactionToken;
    });
    return token;
  },
};
