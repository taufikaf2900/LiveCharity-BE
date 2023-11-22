const { httpServer } = require('../app');
const request = require('supertest');
const { signToken } = require('../helpers/jwt');
const { sequelize, User, Wallet, PaymentHistory } = require('../models');

afterAll(async () => {
  try {
    await sequelize.queryInterface.bulkDelete('Users', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  } catch (error) {
    console.log(error);
  }
});

describe('POST /payment/get-token-midtrans', () => {
  it('Should be failed if user is not logged in yet', async () => {
    const response = await request(httpServer).post('/payment/get-token-midtrans');
    // console.log(response);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'unauthenticated');
  });

  it('Should be failed if user is not registered', async () => {
    const token = signToken({ id: 10, email: 'userNotRegistered@mail.com', username: 'userNotRegistered' });
    const response = await request(httpServer).post('/payment/get-token-midtrans').set('access_token', token);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'unauthenticated');
  });

  it('Should return midtrans token', async () => {
    const newUser = await User.create({
      username: 'Test3',
      email: 'test333@mail.com',
      password: 'secret',
    });
    console.log(newUser);
    const token = signToken(newUser);
    const response = await request(httpServer)
      .post('/payment/get-token-midtrans')
      .set('access_token', token)
      .send({ amount: 10000 });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('midtrans_token', expect.any(String));
  });

  it('Should failed if token empty', async () => {
    const response = await request(httpServer).post('/payment/get-token-midtrans').set('access_token', 'token');
    expect(response.status).toBe(401);
  });
});

describe('POST /payment/balance', () => {
  it('Should failed to update balance if transaction_status not capture', async () => {
    const body = {
      order_id: '89035790134452910',
      transaction_status: 'cancel',
      gross_amound: 100000,
    };

    const response = await request(httpServer).post('/payment/balance').send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Update balance failed');
  });

  it('Should success to update balance if transaction_status is capture', async () => {
    const orderId = 'ORDER-' + new Date().getTime();
    const newUser = await User.create({
      username: 'testPayment',
      email: 'testPayment@mail.com',
      password: 'secret',
    });
    await Wallet.create({ UserId: newUser.id });
    const payment = await PaymentHistory.create({
      UserId: newUser.id,
      orderId,
    });

    const body = {
      order_id: payment.orderId,
      transaction_status: 'capture',
      gross_amount: 100000,
    };
    console.log('response', '<=====================================');
    const response = await request(httpServer).post('/payment/balance').send(body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Update balance Succes');
  });
});
