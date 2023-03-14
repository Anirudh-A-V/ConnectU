const express = require('express');
const { getAllUsers, signUp, login, logout, getUser, sendFriendRequest, acceptFriendRequest } = require('../handlers/userHandlers');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/users', getAllUsers);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/getUser/:username', getUser);
router.post('/send/:username', sendFriendRequest);
router.post('/accept', acceptFriendRequest);

module.exports = router;
