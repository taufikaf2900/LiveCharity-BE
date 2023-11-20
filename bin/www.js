const { httpServer } = require('../app');

const port = Number(process.env.PORT) || 3000;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});