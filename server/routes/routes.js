const express = require('express');
const { getAllUsers, signUp, login } = require('../handlers/userHandlers');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/users', getAllUsers);
router.post('/signup', signUp);
router.get('/login', login);

module.exports = router;
