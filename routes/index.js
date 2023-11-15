const router = require('express').Router();
const errorHandler = require('../middlewares/errorHandler');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hallo from LiveCharity Server'});
});

router.use(errorHandler);

module.exports = router;