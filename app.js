if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const router = require('./routes');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { Livestream, Wallet, Donation } = require('./models');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log(`Client with id ${socket.id} is connect`);
});

app.post('/livestream/donateInRoom', async (req, res, next) => {
  try {
    const { livestreamId: LivestreamId, amount, comment, user } = req.body;
    const checkBalance = await Wallet.findOne({ where: { UserId: user.id } });
    console.log(checkBalance, '@@@@@@@@@@@@@@@@@@@');
    if (checkBalance.balance >= amount) {
      await Wallet.decrement({ balance: amount }, { where: { UserId: user.id } });

      await Donation.create({ LivestreamId, UserId: user.id, amount, comment });
      await Livestream.increment({ currentFunds: amount }, { where: { id: LivestreamId } });

      const findUpdatedLivestream = await Livestream.findByPk(LivestreamId, {
        attributes: ['id', 'currentFunds', 'targetFunds'],
      });

      io.emit('donate', {
        user: user.username,
        nominal: amount,
        message: comment,
        currentFunds: findUpdatedLivestream.currentFunds,
        targetFunds: findUpdatedLivestream.targetFunds,
        fundPercentage: Math.floor(findUpdatedLivestream.currentFunds / findUpdatedLivestream.targetFunds) + '%',
      });

      res.status(200).json({ message: 'Success donate' });
    } else {
      throw { status: 400, error: 'Failed donate' };
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = { httpServer, io };
