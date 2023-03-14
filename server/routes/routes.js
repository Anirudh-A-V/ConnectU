const express = require('express');
const { getAllUsers, signUp, login, logout, getUser, sendFriendRequest } = require('../handlers/userHandlers');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/users', getAllUsers);
router.post('/signup', signUp);
router.get('/login', login);
router.get('/logout', logout);
router.get('/getUser/:username', getUser);
router.post('/send/:username', sendFriendRequest);

module.exports = router;
