const express = require('express');
const { signUp } = require('../handlers/userHandlers');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.post('/signup', signUp);

module.exports = router;
