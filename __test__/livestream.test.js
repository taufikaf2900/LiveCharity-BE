const app = require('../app');
const request = require('supertest');
const { sequelize, User, Livestream } = require('../models');
const users = require('../database/users.json');
const campaign = require('../database/campaign.json');


beforeAll(async() => {
  try {
    await sequelize.queryInterface.bulkInsert('Users', users);
    await sequelize.queryInterface.bulkInsert('Livestreams', campaign);
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
    const response = await request(app).patch('/livestream/1/status').send(body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Update status livestream');
  })
})