const express = require('express');

const postRouter = express.Router();

const { getPosts } = require('../handlers/neutralHandlers');

postRouter.get('/', getPosts);

module.exports = postRouter;