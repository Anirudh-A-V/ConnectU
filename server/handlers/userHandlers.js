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

module.exports = {
    getAllUsers,
    signUp,
    login
};