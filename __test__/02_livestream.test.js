const {httpServer} = require('../app');
const request = require('supertest');
const { sequelize, User, Wallet, Category } = require('../models');
const users = require('../database/users.json');
const campaigns = require('../database/campaign.json');
const categories = require('../database/category.json');
const { signToken } = require('../helpers/jwt');

let access_token = ''
beforeAll(async() => {
  try {
    users.forEach((user) => {
      user.createdAt = '2023-11-16T11:17:32.405Z';
      user.updatedAt = '2023-11-16T11:17:32.405Z';
    });
    categories.forEach((category) => {
      category.createdAt = '2023-11-16T11:17:32.405Z';
      category.updatedAt = '2023-11-16T11:17:32.405Z';
    })
    campaigns.forEach((campaign) => {
      campaign.createdAt = '2023-11-16T11:17:32.405Z';
      campaign.updatedAt = '2023-11-16T11:17:32.405Z';
    });
    await sequelize.queryInterface.bulkInsert('Users', users);
    await sequelize.queryInterface.bulkInsert('Categories', categories);
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
    await sequelize.queryInterface.bulkDelete('Livestreams', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
    await sequelize.queryInterface.bulkDelete('Categories', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
    await sequelize.queryInterface.bulkDelete('Users', null, {
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
    const response = await request(httpServer).patch('/livestream/10/status').send(body);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Livestream is not found');
  })

  it('Should be updated to true from false', async() => {
    const body = {
      statusLive: true
    }
    const response = await request(httpServer).patch('/livestream/1/status').send(body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Update status livestream');
  })

  it('Should be updated to false from true', async() => {
    const body = {
      statusLive: false
    }
    const response = await request(httpServer).patch('/livestream/6/status').send(body);
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
    const response = await request(httpServer).post('/livestream/donate').send(body);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'unauthenticated');
  })

  it('Should be failed if user does not registered', async () => {
    const token = signToken({id: 10, username: 'userNotExists', email: 'userNotExists@mail.com' });
    const body = {
      livestreamId: 6,
      amount: 10000,
      comment: 'Walau sedikit semoga bermanfaat ya'
    }
    const response = await request(httpServer).post('/livestream/donate').set('access_token', token).send(body);

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
    const response = await request(httpServer).post('/livestream/donate').set('access_token', access_token).send(body);
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
    const response = await request(httpServer).post('/livestream/donate').set('access_token', access_token).send(body);
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Success donate');
  });
})

describe('GET /campaign', () => {
  it('Should return all campaign data', async() => {
    const response = await request(httpServer).get('/campaign');
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toBeInstanceOf(Object);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('createdAt');
    expect(response.body[0]).toHaveProperty('updatedAt');
    expect(response.body[0]).toHaveProperty('Livestreams');
    expect(response.body[0].Livestreams).toBeInstanceOf(Array);
    expect(response.body[0].Livestreams[0]).toBeInstanceOf(Object);
    expect(response.body[0].Livestreams[0]).toHaveProperty('id');
    expect(response.body[0].Livestreams[0]).toHaveProperty('title');
    expect(response.body[0].Livestreams[0]).toHaveProperty('roomId');
    expect(response.body[0].Livestreams[0]).toHaveProperty('targetFunds');
    expect(response.body[0].Livestreams[0]).toHaveProperty('currentFunds');
    expect(response.body[0].Livestreams[0]).toHaveProperty('expireDate');
    expect(response.body[0].Livestreams[0]).toHaveProperty('thumbnail');
    expect(response.body[0].Livestreams[0]).toHaveProperty('description');
    expect(response.body[0].Livestreams[0]).toHaveProperty('statusLive');
    expect(response.body[0].Livestreams[0]).toHaveProperty('UserId');
    expect(response.body[0].Livestreams[0]).toHaveProperty('createdAt');
    expect(response.body[0].Livestreams[0]).toHaveProperty('updatedAt');
  });
})

describe('GET /campaign/:livestreamId', () => {
  it('Should return detail campaign', async() => {
    const response = await request(httpServer).get('/campaign/6');
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('id', expect.any(Number));
    expect(response.body).toHaveProperty('title', expect.any(String));
    expect(response.body).toHaveProperty('roomId', expect.any(String));
    expect(response.body).toHaveProperty('targetFunds', expect.any(Number));
    expect(response.body).toHaveProperty('currentFunds', expect.any(Number));
    expect(response.body).toHaveProperty('expireDate', expect.any(String));
    expect(response.body).toHaveProperty('thumbnail', expect.any(String));
    expect(response.body).toHaveProperty('description', expect.any(String));
    expect(response.body).toHaveProperty('statusLive', expect.any(Boolean));
    expect(response.body).toHaveProperty('UserId', expect.any(Number));
    expect(response.body).toHaveProperty('createdAt', expect.any(String));
    expect(response.body).toHaveProperty('updatedAt', expect.any(String));
    expect(response.body).toHaveProperty('Donations', expect.any(Array));
    expect(response.body).toHaveProperty('User', expect.any(Object));
  })

  it('Should be failed if campaign does not exists in database', async() => {
    const response = await request(httpServer).get('/campaign/10');

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Campaign is not found')
  });
})

describe('POST /campaign', () => {
  it('Should be failed if user is not login yet', async() => {
    const body = {
      title: 'Testing',
      targetFunds: 1000000,
      thumbnail: 'https://ayobantu.com/storage/campaign/27_1_BwdbAuQSjoPm5HosmPsJmfC5WJhwzO_1626923331.jpg',
      expireDate: new Date('2024-09-12'),
      description: 'Testing'
    }
    const response = await request(httpServer).post('/campaign').send(body);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'unauthenticated');
  })

  it('Should be failed if user is not registered', async() => {
    const body = {
      title: 'Testing',
      targetFunds: 1000000,
      thumbnail: 'https://ayobantu.com/storage/campaign/27_1_BwdbAuQSjoPm5HosmPsJmfC5WJhwzO_1626923331.jpg',
      expireDate: new Date('2024-09-12'),
      description: 'Testing'
    }
    const token = signToken({id: 10, username: 'userNotExists', email: 'userNotExists@mail.com' });
    const response = await request(httpServer).post('/campaign').set('access_token', token).send(body);
    // console.log(response);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'unauthenticated');
  })

  it('Should be failed if title is missing', async() => {
    const response = await request(httpServer).post('/campaign').set('access_token', access_token);
    // console.log(response);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Title is required');
  })

  it('Should be failed if targetFunds is missing', async() => {
    const body = {
      title: 'Testing'
    }
    const response = await request(httpServer).post('/campaign').set('access_token', access_token).send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Target Funds is required');
  })

  it('Should be failed if thumbnail is missing', async() => {
    const body = {
      title: 'Testing',
      targetFunds: 1000000
    }
    const response = await request(httpServer).post('/campaign').set('access_token', access_token).send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Expire Date is required');
  })

  it('Should be failed if description is missing', async() => {
    const body = {
      title: 'Testing',
      targetFunds: 1000000,
      thumbnail: 'https://70867a2ef4c36f4d1885-185a360f54556c7e8b9c7a9b6e422c6e.ssl.cf6.rackcdn.com/picture/campaign/2023-11-13/P8Qz5AHb2URH.jpg'
    }
    const response = await request(httpServer).post('/campaign').set('access_token', access_token).send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Expire Date is required');
  })

  it('Should be failed if expireDate is missing', async() => {
    const body = {
      title: 'Testing',
      targetFunds: 1000000,
      thumbnail: 'https://70867a2ef4c36f4d1885-185a360f54556c7e8b9c7a9b6e422c6e.ssl.cf6.rackcdn.com/picture/campaign/2023-11-13/P8Qz5AHb2URH.jpg',
      description: 'Testing'
    }
    const response = await request(httpServer).post('/campaign').set('access_token', access_token).send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Expire Date is required');
  })

  it('Should be failed if expireDate is less than today', async() => {
    const body = {
      title: 'Testing',
      targetFunds: 1000000,
      thumbnail: 'https://70867a2ef4c36f4d1885-185a360f54556c7e8b9c7a9b6e422c6e.ssl.cf6.rackcdn.com/picture/campaign/2023-11-13/P8Qz5AHb2URH.jpg',
      description: 'Testing',
      expireDate: new Date('2022-10-01')
    }
    const response = await request(httpServer).post('/campaign').set('access_token', access_token).send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Minimum time of livestream is tomorrow!');
  })

  it('Should be success if user has been logged in and fill all the field', async() => {
    const body = {
      title: 'Testing',
      targetFunds: 1000000,
      thumbnail: 'https://70867a2ef4c36f4d1885-185a360f54556c7e8b9c7a9b6e422c6e.ssl.cf6.rackcdn.com/picture/campaign/2023-11-13/P8Qz5AHb2URH.jpg',
      description: 'Testing',
      expireDate: new Date('2024-09-12'),
      categoryId: 1
    }

    const response = await request(httpServer).post('/campaign').set('access_token', access_token)
      .field('title', 'Testing')
      .field('targetFunds', 10000000)
      .field('thumbnail', '/assets/images/')
      .field('title', 'Testing')
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('title', 'Testing');
    expect(response.body).toHaveProperty('targetFunds', 1000000);
    expect(response.body).toHaveProperty('thumbnail', 'https://70867a2ef4c36f4d1885-185a360f54556c7e8b9c7a9b6e422c6e.ssl.cf6.rackcdn.com/picture/campaign/2023-11-13/P8Qz5AHb2URH.jpg');
    expect(response.body).toHaveProperty('expireDate', expect.any(String));
    expect(response.body).toHaveProperty('UserId', expect.any(Number));
    expect(response.body).toHaveProperty('roomId', expect.any(String))
  })
})