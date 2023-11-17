const app = require('../app');
const request = require('supertest');
const { sequelize } = require('../models');

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
    const response = await request(app).post('/users/register');

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Username is required');
  })

  it('Should be failed if password is empty', async() => {
    const body = {
      username: "user1"
    }
    const response = await request(app).post('/users/register').send(body);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });

  it('Should be failed if email is empty', async() => {
    const body = {
      username: "user1",
      password: "secret"
    }
    const response = await request(app).post('/users/register').send(body);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  it('Should be success if all data is fullfiled', async() => {
    const body = {
      username: "user1",
      password: "secret",
      email: 'user1@mail.com'
    }
    const response = await request(app).post('/users/register').send(body);
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Register success');
  });
})

describe('POST /users/login', () => {
  it('Should be failed if email is empty', async() => {
    const response = await request(app).post('/users/login');

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  it('Should be failed if password is empty', async() => {
    const body = {
      email: 'user1@mail.com'
    }
    const response = await request(app).post('/users/login').send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });

  it('Should be success if data is match', async() => {
    const body = {
      email: 'user1@mail.com',
      password: 'secret'
    }
    const response = await request(app).post('/users/login').send(body);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('access_token', expect.any(String));
    expect(response.body).toHaveProperty('id', expect.any(Number));
    expect(response.body).toHaveProperty('username', 'user1');
  });  
})