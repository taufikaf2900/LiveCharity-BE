const app = require('../app');
const request = require('supertest');
const { sequelize, User, Wallet } = require('../models');
const users = require('../database/users.json');
const campaigns = require('../database/campaign.json');
const { signToken } = require('../helpers/jwt');

let access_token = ''
beforeAll(async() => {
  try {
    users.forEach((user) => {
      user.createdAt = new Date();
      user.updatedAt = new Date();
    });
    campaigns.forEach((campaign) => {
      campaign.createdAt = new Date();
      campaign.updatedAt = new Date();
    })
    await sequelize.queryInterface.bulkInsert('Users', users);
    await sequelize.queryInterface.bulkInsert('Livestreams', campaigns);
    const userDonate = await User.create({
      username: 'userDonate',
      email: 'userDonate@mail.com',
      password: 'secret'
    });
    access_token = signToken(userDonate);
    await Wallet.create({UserId: userDonate.id});
  } catch (error) {
    console.log(error);
  }
});

afterAll(async() => {
  try {
    await sequelize.queryInterface.bulkDelete('Users', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });

    await sequelize.queryInterface.bulkDelete('Livestreams', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
  } catch (error) {
    console.log(error);
  }
});

describe('Testing livestream PATCH route', () => {
  it('Should be failed if livestream is not found', async() => {
    const body = {
      statusLive: true
    }
    const response = await request(app).patch('/livestream/10/status').send(body);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Livestream is not found');
  })

  it('Should be updated to true from false', async() => {
    const body = {
      statusLive: true
    }
    const response = await request(app).patch('/livestream/1/status').send(body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Update status livestream');
  })

  it('Should be updated to false from true', async() => {
    const body = {
      statusLive: false
    }
    const response = await request(app).patch('/livestream/6/status').send(body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Update status livestream');
  })

  it('Should be failed donate if user not login yet', async() => {
    const body = {
      livestreamId: 6,
      amount: 10000,
      comment: 'Walau sedikit semoga bermanfaat ya'
    }
    const response = await request(app).post('/livestream/donate').send(body);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'unauthenticated');
  })

  it('Should be failed if user does not exist in database', async () => {
    const token = signToken({id: 10, username: 'userNotExists', email: 'userNotExists@mail.com' });
    const body = {
      livestreamId: 6,
      amount: 10000,
      comment: 'Walau sedikit semoga bermanfaat ya'
    }
    const response = await request(app).post('/livestream/donate').set('access_token', token).send(body);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'unauthenticated');
  });

  it('Should be failed donate if the balance is not enough', async() => {
    const body = {
      livestreamId: 6,
      amount: 10000,
      comment: 'Walau sedikit semoga bermanfaat ya'
    }
    const response = await request(app).post('/livestream/donate').set('access_token', access_token).send(body);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Failed donate')
  })

  it('Should be success donate if user has been login and user balance is enough', async() => {
    const body = {
      livestreamId: 6,
      amount: 0,
      comment: 'Walau sedikit semoga bermanfaat ya'
    }
    const response = await request(app).post('/livestream/donate').set('access_token', access_token).send(body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Success donate');
  });
})