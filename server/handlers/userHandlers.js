const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password -accessTokens -request');
        return res.status(200).json({ users });
    } catch (error) {
        console.log('Error occurred while fetching users:', error);
        res.status(500).json({ error });
    }
};

const signUp = async (req, res) => {
    try {
        const { name, username, password, email, image } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({ name, username, password: hashedPassword, email, image });

        const token = jwt.sign({ username: result.username }, process.env.ACCESS_TOKEN_SECRET);

        // add access token to user
        result.accessTokens.push(token);
        await result.save();
        return res.status(201).json({ result, token });

    } catch (error) {
        console.log('Error occurred while saving user:', error);
        return res.status(500).json({ error });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
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
        const authHeader = req.headers['authorization'];
        const Token = authHeader && authHeader.split(' ')[1];

        await User.updateOne({ username }, { $pull: { accessTokens: Token } });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log('Error occurred while logging out user:', error);
        res.status(500).json({ error });
    }
};


const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id }).select('-password -accessTokens -request');
        res.status(200).json({ user });
    } catch (error) {
        console.log('Error occurred while fetching user:', error);
        res.status(500).json({ error });
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (user == null) {
            return res.status(400).json({ message: 'Cannot find user' });
        }

        res.status(200).json({ message: 'User verified' });
    } catch (error) {
        console.log('Error occurred while verifying email:', error);
        res.status(500).json({ error });
    }
};



module.exports = {
    getAllUsers,
    signUp,
    login,
    logout,
    getUser,
    verifyEmail
};