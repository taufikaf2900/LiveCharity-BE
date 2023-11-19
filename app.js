if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const router = require('./routes');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./socket');

const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

io.on('connection', (socket) => {
  console.log(`Client with id ${socket.id} is connect`);
  socketHandler(socket, io);
})

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


// module.exports = app;
