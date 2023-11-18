if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const router = require('./routes');
const cors = require('cors');

const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

module.exports = app;
