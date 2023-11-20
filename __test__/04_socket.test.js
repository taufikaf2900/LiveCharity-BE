const io = require('socket.io-client');
const { io: server } = require('../app');
const { User, Livestream, Category, sequelize } = require('../models');

describe('Suite of unit tests', function () {
  server.attach(3005);
  let socket1;
  let socket2;
  let socket3;
  let user1;
  let user2;
  let category;
  let liveStream;

  beforeAll(async () => {
    try {
      socket1 = io('http://localhost:3005');
      socket2 = io('http://localhost:3005');
      socket3 = io('http://localhost:3005');

      user1 = await User.create({
        username: 'testDonate1',
        email: 'testDonate1@mail.com',
        password: 'secret',
      });

      user2 = await User.create({
        username: 'testDonate2',
        email: 'testDonate2@mail.com',
        password: 'secret',
      });

      category = await Category.create({
        name: 'disaster',
      });

      liveStream = await Livestream.create({
        title: 'Test donate',
        roomId: '2345',
        targetFunds: 10000000,
        expireDate: '2023-11-22',
        thumbnail:
          'https://70867a2ef4c36f4d1885-185a360f54556c7e8b9c7a9b6e422c6e.ssl.cf6.rackcdn.com/picture/campaign/2023-11-13/P8Qz5AHb2URH.jpg',
        description: 'Test donate desc',
        UserId: user1.id,
        CategoryId: category.id,
      });

      socket1.emit('join-room', {
        roomId: liveStream.roomId,
        username: user1.username,
      });

      socket2.emit('join-room', {
        roomId: liveStream.roomId,
        username: user2.username,
      });
    } catch (error) {
      console.log(error);
    }
  });

  // beforeEach(function (done) {
  //   // Setup
  //   socket1.on('connect', function () {
  //     socket2.on('connect', function () {
  //       console.log('worked...');
  //       done();
  //     });
  //     // console.log('worked...');
  //     // done();
  //   });
  //   socket1.on('disconnect', function () {
  //     console.log('disconnected...');
  //   });
  // });

  // afterEach(function (done) {
  //   // Cleanup
  //   if (socket.connected) {
  //     console.log('disconnecting...');
  //     socket1.disconnect();
  //     socket2.disconnect();
  //   } else {
  //     // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
  //     console.log('no connection to break...');
  //   }
  //   done();
  // });

  afterAll(async function () {
    socket1.disconnect();
    socket2.disconnect();
    server.close();
    await sequelize.queryInterface.bulkDelete('Livestreams');
    await sequelize.queryInterface.bulkDelete('Users');
    await sequelize.queryInterface.bulkDelete('Categories');
  });

  describe('Join room tests', function () {
    it('should work', (done) => {
      socket3.emit('join-room', {
        roomId: '1234',
        username: 'user3',
      });

      socket3.on('join-room-success', (payload) => {
        try {
          expect(payload).toHaveProperty('roomId', '1234');
          expect(payload).toHaveProperty('username', 'user3');
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('Donation test', () => {
    it('Should work', (done) => {
      socket2.emit('send-donation', {
        LivestreamId: liveStream.id,
        roomId: liveStream.roomId,
        username: user2.username,
        UserId: user2.id,
        amount: 100000,
        comment: 'Get Well Soon!',
      });

      socket1.on('send-donation-success', (payload) => {
        try {
          console.log(payload);
          expect(payload).toHaveProperty('roomId', '2345');
          expect(payload).toHaveProperty('username', 'testDonate2');
          expect(payload).toHaveProperty('amount', 100000);
          expect(payload).toHaveProperty('comment', 'Get Well Soon!');
          expect(payload).toHaveProperty('currentFunds', expect.any(Number));
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
