const { httpServer } = require('../app');
const request = require('supertest');
const { sequelize, User, Wallet, Category } = require('../models');
const { signToken } = require('../helpers/jwt');
const users = require('../database/users.json');
const campaigns = require('../database/campaign.json');
const categories = require('../database/category.json');
beforeAll(async () => {
  try {
    users.forEach((user) => {
      user.createdAt = '2023-11-16T11:17:32.405Z';
      user.updatedAt = '2023-11-16T11:17:32.405Z';
    });
    categories.forEach((category) => {
      category.createdAt = '2023-11-16T11:17:32.405Z';
      category.updatedAt = '2023-11-16T11:17:32.405Z';
    });
    campaigns.forEach((campaign) => {
      campaign.createdAt = '2023-11-16T11:17:32.405Z';
      campaign.updatedAt = '2023-11-16T11:17:32.405Z';
    });
    await sequelize.queryInterface.bulkInsert('Users', users);
    await sequelize.queryInterface.bulkInsert('Categories', categories);
    await sequelize.queryInterface.bulkInsert('Livestreams', campaigns);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await sequelize.queryInterface.bulkDelete('Livestreams', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await sequelize.queryInterface.bulkDelete('Categories', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await sequelize.queryInterface.bulkDelete('Users', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  } catch (error) {
    console.log(error);
  }
});

describe('POST /users/register', () => {
  it('Should be failed if username is empty', async () => {
    const response = await request(httpServer).post('/users/register');

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Username is required');
  });

  it('Should be failed if password is empty', async () => {
    const body = {
      username: 'user1',
    };
    const response = await request(httpServer).post('/users/register').send(body);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });

  it('Should be failed if email is empty', async () => {
    const body = {
      username: 'user1',
      password: 'secret',
    };
    const response = await request(httpServer).post('/users/register').send(body);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  it('Should be success if all data is fullfiled', async () => {
    const body = {
      username: 'user1',
      password: 'secret',
      email: 'user1@mail.com',
    };
    const response = await request(httpServer).post('/users/register').send(body);
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Register success');
  });
});

describe('POST /users/login', () => {
  it('Should be failed if email is empty', async () => {
    const response = await request(httpServer).post('/users/login');

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  it('Should be failed if password is empty', async () => {
    const body = {
      email: 'user1@mail.com',
    };
    const response = await request(httpServer).post('/users/login').send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });

  it('Should be success if data is match', async () => {
    const body = {
      email: 'user1@mail.com',
      password: 'secret',
    };
    const response = await request(httpServer).post('/users/login').send(body);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('access_token', expect.any(String));
    expect(response.body).toHaveProperty('id', expect.any(Number));
    expect(response.body).toHaveProperty('username', 'user1');
  });
});

describe('POST /users/balance', () => {
  it('Should be get balance user', async () => {
    const token = signToken({ id: 1, username: 'dudungxxx', email: 'dudungxxx@gmail.com' });
    const user = await Wallet.findAll();
    const response = await request(httpServer).get('/users/balance').set('access_token', token);
    expect(response.status).toBe(200);
    // expect(response.body).toBeInstanceOf(Object);
  });

  it('Should be get balance user', async () => {
    const token = signToken({ id: 1, username: 'dudungxxx', email: 'dudungxxx@gmail.com' });
    const response = await request(httpServer).post('/users/decodeJwt').send({ token, livestreamId: 1 });
    // console.log(response);
    expect(response.status).toBe(200);
    // expect(response.body).toBeInstanceOf(Object);
  });
});
