const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const post = new Post({
            images: content.images,
            caption: content.caption,
            user: req.user._id
        });
        await post.save();
        return res.status(201).json({ post });
    } catch (error) {
        console.log('Error occurred while creating post:', error);
        res.status(500).json({ error });
    }
};