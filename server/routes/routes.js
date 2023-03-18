const express = require('express');
const { getAllUsers, signUp, login, logout, getUser, sendFriendRequest, acceptFriendRequest, unFriend, mutualFriends, getFriends, getFriendRequests, cancelFriendRequest, ignoreFriendRequest, isFriendOrRequestSent } = require('../handlers/userHandlers');
const authenticateToken = require('../auth/auth');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/users', authenticateToken, getAllUsers);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.get('/getUser/:id', authenticateToken, getUser);
router.post('/send/:id', authenticateToken, sendFriendRequest);
router.post('/accept', authenticateToken, acceptFriendRequest);
router.post('/unfriend/:id', authenticateToken, unFriend);
router.post('/mutual/:id', authenticateToken, mutualFriends);
router.post('/friends', authenticateToken, getFriends);
router.post('/friendrequests', authenticateToken, getFriendRequests);
router.post('/cancel/:username', authenticateToken, cancelFriendRequest);
router.post('/ignore/:username', authenticateToken, ignoreFriendRequest);
router.post('/confirm/:id', authenticateToken, isFriendOrRequestSent);

module.exports = router;
