const app = require('../app');
const request = require('supertest');
const { sequelize, Livestream } = require('../models');
const campaigns = require('../database/campaign.json');


beforeAll(async() => {
  try {
    campaigns.forEach((campaign) => {
      campaign.createdAt = new Date();
      campaign.updatedAt = new Date();
    });
    await sequelize.queryInterface.bulkInsert('Livestreams', campaigns);
  } catch (error) {
    console.log(error);
  }
})

describe('GET /campaign', () => {
  it('Should return all campaign data', async() => {
    const response = await request(app).get('/campaign');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  })
})