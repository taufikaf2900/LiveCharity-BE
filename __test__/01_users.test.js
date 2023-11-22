const {httpServer} = require('../app');
const request = require('supertest');
const { sequelize, User } = require('../models');

let duplicate1;
let duplicate2;
beforeAll(async() => {
  try {
    duplicate1 = await User.create({
      username: 'duplicate1',
      email: 'duplicate1@mail.com',
      password: 'secret'
    });
  
    duplicate2 = await User.create({
      username: 'duplicate2',
      email: 'duplicate2@mail.com',
      password: 'secret'
    });
  } catch (error) {
    console.log(error);
  }
})

afterAll(async() => {
  try {
    await sequelize.queryInterface.bulkDelete('Users', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    })
  } catch (error) {
    console.log(error);
  }
})

describe('POST /users/register', () => {
  it('Should be failed if username is empty', async() => {
    const response = await request(httpServer).post('/users/register');

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Username is required');
  })

  it('Should be failed if password is empty', async() => {
    const body = {
      username: "user1"
    }
    const response = await request(httpServer).post('/users/register').send(body);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });

  it('Should be failed if email is empty', async() => {
    const body = {
      username: "user1",
      password: "secret"
    }
    const response = await request(httpServer).post('/users/register').send(body);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  it('Should be failed if username is already used', async() => {
    const body = {
      username: "duplicate1",
      password: "secret",
      email: "duplicate3@mail.com"
    }
    const response = await request(httpServer).post('/users/register').send(body);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Username is already used');
  });

  it('Should be failed if email is already used', async() => {
    const body = {
      username: "duplicate3",
      password: "secret",
      email: "duplicate1@mail.com"
    }
    const response = await request(httpServer).post('/users/register').send(body);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is already used');
  });

  it('Should be success if all data is fullfiled', async() => {
    const body = {
      username: "user1",
      password: "secret",
      email: 'user1@mail.com'
    }
    const response = await request(httpServer).post('/users/register').send(body);
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Register success');
  });
})

describe('POST /users/login', () => {
  it('Should be failed if email is empty', async() => {
    const response = await request(httpServer).post('/users/login');

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  it('Should be failed if password is empty', async() => {
    const body = {
      email: 'user1@mail.com'
    }
    const response = await request(httpServer).post('/users/login').send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });

  it('Should be failed if email is not match', async() => {
    const body = {
      email: 'duplicate4',
      password: 'secret'
    }

    const response = await request(httpServer).post('/users/login').send(body);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Invalid email/password');
  });

  it('Should be failed if password is not match', async() => {
    const body = {
      email: 'duplicate1',
      password: 'secrets'
    }

    const response = await request(httpServer).post('/users/login').send(body);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Invalid email/password');
  }); 

  it('Should be success if data is match', async() => {
    const body = {
      email: 'user1@mail.com',
      password: 'secret'
    }
    const response = await request(httpServer).post('/users/login').send(body);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('access_token', expect.any(String));
    expect(response.body).toHaveProperty('id', expect.any(Number));
    expect(response.body).toHaveProperty('username', 'user1');
  });  
})