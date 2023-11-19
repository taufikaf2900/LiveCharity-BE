const socketHandler = (socket, io) => {
  const createRoom = (data) => {
    socket.join('1234');
    io.emit('Hello Taufik hopully your livestream is going well');
    console.log('user create a room');
  }
  const joinRoom = (data) => {
    console.log(data, '<===============');
    console.log('User join the room');
    io.emit('join-room-ok', data)
  }

  socket.on('send-message', (data) => {
    io.emit('send-back-message', data);
  })


  socket.on('create-room', createRoom);
  socket.on('join-room', joinRoom)

  socket.on('disconnect', (reason) => {
    console.log('client has been disconnected because of', reason);
  })
}

module.exports = socketHandler;