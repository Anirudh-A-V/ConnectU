const express = require('express');
const { signUp, login, logout, getUser } = require('../handlers/userHandlers');
const { sendFriendRequest, acceptFriendRequest, unFriend, mutualFriends, getFriends, getFriendRequests, cancelFriendRequest, ignoreFriendRequest, isFriendOrRequestSent } = require('../handlers/friendHandlers');
const { getAllUsers, getPosts } = require('../handlers/neutralHandlers');
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
router.post('/cancel/:id', authenticateToken, cancelFriendRequest);
router.post('/ignore/:id', authenticateToken, ignoreFriendRequest);
router.post('/confirm/:id', authenticateToken, isFriendOrRequestSent);

router.get('/posts', getPosts);

module.exports = router;
