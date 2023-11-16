const router = require('express').Router();
const UserController = require('../../controllers/usersControllers/userController');


router.post('/login', UserController.handleLogin);
router.post('/register', UserController.handleRegister);

module.exports = router;
