const { Donation, Livestream } = require('../models');

const socketHandler = (socket, io) => {
  const joinRoom = (payload) => {
    console.log('User join the room');
    socket.join(payload.roomId);
    socket.emit('join-room-success', payload)
  }

  const sendDonation = async (payload) => {
    try {
      console.log(payload, 'HIIIIIIIIIIIIIIIIIIIII')
      await Donation.create({ UserId: payload.UserId, LivestreamId: payload.LivestreamId, amount: payload.amount, comment: payload.comment});
      const livestream = await Livestream.findByPk(payload.LivestreamId);

      io.in(payload.roomId).emit('send-donation-success', {
        roomId: payload.roomId,
        username: payload.username,
        amount: payload.amount,
        comment: payload.comment,
        currentFunds: livestream.currentFunds
      });
    } catch (error) {
      console.log(error);
    }
  }
  // socket.on('create-room', createRoom);
  socket.on('join-room', joinRoom);
  socket.on('send-donation', sendDonation);

  socket.on('disconnect', () => {
    console.log('client has been disconnected');
  })
}

module.exports = socketHandler;