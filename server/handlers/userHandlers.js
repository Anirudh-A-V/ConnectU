const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        return res.status(200).json({ users});
    } catch (error) {
        res.status(500).json({ error });
    }
};

const signUp = async (req, res) => {
    try {
        const {name, username, password, email, image } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({ name, username, password: hashedPassword, email, image });

        
        const token = jwt.sign({ username: result.username }, process.env.ACCESS_TOKEN_SECRET);
        
        // add access token to user
        result.accessTokens.push(token);
        await result.save();
        
        console.log(result);
        return res.status(201).json({ result, token });

    } catch (error) {
        console.log('Error occurred while saving user:', error);
        return res.status(500).json({ error });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user == null) {
            return res.status(400).json({ message: 'Cannot find user' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);
        // add access token to user
        user.accessTokens.push(token);
        await user.save();

        return res.status(200).json({ user, token });
    } catch (error) {
        console.log('Error occurred while logging in user:', error);
        res.status(500).json({ error });
    }
};

const logout = async (req, res) => {
    try {
        const { username } = req.body;
        const authHeader = req.headers['authorization']
        const Token = authHeader && authHeader.split(' ')[1]

        // remove access token from user
        const user = await User.findOne({ username });
        user.accessTokens = user.accessTokens.filter(token => token != Token)
        await user.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const getUser = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password');
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const sendFriendRequest = async (req, res) => {
    try {
        const { username } = req.params;
        const { user } = req.body;

        const friend = await User.findOne({ username });
        const currentUser = await User.findOne({ username: user.username });

        if (currentUser.Friends.includes(friend._id)) {
            return res.status(409).json({ message: 'User already added' });
        }

        currentUser.request.to.push(friend._id);
        friend.request.from.push(currentUser._id);

        await currentUser.save();
        await friend.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        console.log('Error occurred while sending friend request:', error);
        res.status(500).json({ error });
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const { user, friend } = req.body;

        const currentUser = await User.findOne({ username: user.username });
        const friendUser = await User.findOne({ username: friend.username });

        currentUser.Friends.push(friendUser._id);
        friendUser.Friends.push(currentUser._id);

        currentUser.request.to = currentUser.request.to.filter(id => id != friendUser._id);
        friendUser.request.from = friendUser.request.from.filter(id => id != currentUser._id);

        await currentUser.save();
        await friendUser.save();

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        res.status(500).json({ error });
    }
};

module.exports = {
    getAllUsers,
    signUp,
    login,
    logout,
    getUser,
    sendFriendRequest,
    acceptFriendRequest
};