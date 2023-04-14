const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/usersControllers');
const { isAuth } = require('../service/auth');

/* GET users listing. */
router.post('/signup', usersControllers.signup);
router.post('/signin', usersControllers.signin);
router.get('/profile', isAuth, usersControllers.getUser);
router.patch('/profile', isAuth, usersControllers.editUser);
router.patch('/updatePassword', isAuth, usersControllers.updatePassword);

module.exports = router;
