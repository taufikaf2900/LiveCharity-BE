const router = require('express').Router();
const UserController = require('../../controllers/usersControllers/userController');
const authentication = require('../../middlewares/authentication');


router.post('/login', UserController.handleLogin);
router.post('/register', UserController.handleRegister);
router.get('/balance', authentication, UserController.handleBalance);

module.exports = router;
