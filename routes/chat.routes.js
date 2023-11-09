const express = require('express');
const {chat, profile,logout, profileUpdate,accountSuspend} = require('../controllers/chat.controller');
const { authorization } = require('../middleware/authenticate');
const { upload }=require('../middleware/fileUploadMiddleware');
const router = express.Router();

router.get('/chat',authorization, chat);
router.get('/profile',authorization, profile);
router.post('/profile/update',authorization,upload.single('image'), profileUpdate);
router.get('/account-suspended',authorization,accountSuspend);
router.get('/logout',authorization,logout);

module.exports = router;
