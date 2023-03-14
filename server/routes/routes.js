const express = require('express');
const { getAllUsers, signUp, login, logout, getUser } = require('../handlers/userHandlers');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/users', getAllUsers);
router.post('/signup', signUp);
router.get('/login', login);
router.get('/logout', logout);
router.get('/user/:username', getUser);

module.exports = router;
