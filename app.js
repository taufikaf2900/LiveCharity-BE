if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const router = require('./routes');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./socket');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, './assets/images')
  },
  filename: (req, file, cb) => {
    return cb(null, new Date().getTime() + '-' + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(null, false)
  }
}

const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer({storage, fileFilter}).single('image'));
app.use('/assets/images', express.static(path.join(__dirname, 'assets', 'images')))
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


// module.exports = httpServer;
