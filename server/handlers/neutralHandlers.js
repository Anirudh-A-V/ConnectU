const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('user', 'name username image');
        return res.status(200).json({ posts });
    } catch (error) {
        console.log('Error occurred while fetching posts:', error);
        res.status(500).json({ error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password -accessTokens -request');
        return res.status(200).json({ users });
    } catch (error) {
        console.log('Error occurred while fetching users:', error);
        res.status(500).json({ error });
    }
};

module.exports = {
    getPosts,
    getAllUsers
};