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

        const user = User.findById(req.user._id);
        user.noOfPosts += 1;
        user.Posts.push(post._id);
        return res.status(201).json({ post });
    } catch (error) {
        console.log('Error occurred while creating post:', error);
        res.status(500).json({ error });
    }
};

const commentOnPost = async (req, res) => {
    try {
        const { comment } = req.body;
        const post = await Post.findById(req.params.id);
        post.comments.push({
            user: req.user._id,
            comment
        });
        await post.save();
        return res.status(200).json({ comment: post.comments[post.comments.length - 1] });
    } catch (error) {
        console.log('Error occurred while commenting on post:', error);
        res.status(500).json({ error });
    }
}

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.user._id)) {
            post.likes = post.likes.filter(like => like !== req.user._id);
            post.noOfLikes -= 1;
            await post.save();
            return res.status(200).json({ status: 'unliked', post });
        }
        post.likes.push(req.user._id);
        post.noOfLikes += 1;
        await post.save();
        return res.status(200).json({ status: 'liked', post });
    } catch (error) {
        console.log('Error occurred while liking post:', error);
        res.status(500).json({ error });
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await post.remove();
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log('Error occurred while deleting post:', error);
        res.status(500).json({ error });
    }
}

module.exports = {
    createPost,
    commentOnPost,
    likePost,
    deletePost
};
