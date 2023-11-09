const express = require('express');
const {login, register, registerStore, loginStore} = require('../controllers/front.controller');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

router.get('/login',authenticate, login)
router.get('/register',authenticate, register)

router.post('/register/store', registerStore)
router.post('/login/store', loginStore)

module.exports = router;
