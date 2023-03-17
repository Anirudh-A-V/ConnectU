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
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password -accessTokens -request');
        res.status(200).json({ user });
    } catch (error) {
        console.log('Error occurred while fetching user:', error);
        res.status(500).json({ error });
    }
};

const sendFriendRequest = async (req, res) => {
    try {
      const { username } = req.params;
      const { user } = req.body;
  
      const friend = await User.findOne({ username });
      const currentUser = await User.findOneAndUpdate(
        { username: user.username },
        { $addToSet: { 'request.to': friend._id } },
        { new: true }
      );
      const isRequestReceived = friend.request.from.includes(currentUser._id);

      if (friend.username === currentUser.username) {
        currentUser.request.to.pull(friend._id);
        return res.status(409).json({ message: 'Cannot send friend request to yourself' });
    }
  
      if (isRequestReceived) {
        currentUser.request.to.pull(friend._id);
        return res.status(409).json({ message: 'Request already received' });
      } else if (currentUser.Friends.includes(friend._id) || friend.Friends.includes(currentUser._id)) {
        currentUser.request.to.pull(friend._id);
        return res.status(409).json({ message: 'User already added' });
      }
  
      await friend.updateOne({ $addToSet: { 'request.from': currentUser._id } });
  
      res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
      console.log('Error occurred while sending friend request:', error);
      res.status(500).json({ error });
    }
  };
  

const acceptFriendRequest = async (req, res) => {
    try {
        const { user, friend } = req.body;

        const [currentUser, friendUser] = await Promise.all([
            User.findOne({ username: user.username }),
            User.findOne({ username: friend.username })
        ]);

        if (!currentUser.request.from.includes(friendUser._id)) {
            return res.status(409).json({ message: 'Request not received' });
        }

        if (currentUser.Friends.includes(friendUser._id) || friendUser.Friends.includes(currentUser._id)) {
            return res.status(409).json({ message: 'User already added' });
        }

        await Promise.all([
            currentUser.updateOne({ $pull: { 'request.from': friendUser._id } }),
            friendUser.updateOne({ $pull: { 'request.to': currentUser._id } })
        ]);

        await Promise.all([
            currentUser.updateOne({ $addToSet: { Friends: friendUser._id } }),
            friendUser.updateOne({ $addToSet: { Friends: currentUser._id } })
        ]);

        await Promise.all([currentUser.save(), friendUser.save()]);

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        console.log('Error occurred while accepting friend request:', error);
        res.status(500).json({ error });
    }
};

const unFriend = async (req, res) => {
    try {
        const { username } = req.params;
        const { user } = req.body;

        const [currentUser, friendUser] = await Promise.all([
            User.findOne({ username: user.username }),
            User.findOne({ username: username })
        ]);

        if (!currentUser.Friends.includes(friendUser._id)) {
            return res.status(409).json({ message: 'User not added' });
        }

        await Promise.all([
            currentUser.updateOne({ $pull: { Friends: friendUser._id } }),
            friendUser.updateOne({ $pull: { Friends: currentUser._id } })
        ]);

        res.status(200).json({ message: 'User unfriended' });
    } catch (error) {
        console.log('Error occurred while unfriending user:', error);
        res.status(500).json({ error });
    }
};

const ignoreFriendRequest = async (req, res) => {
    try {
        const { username } = req.params;
        const { user } = req.body;

        const [currentUser, friendUser] = await Promise.all([
            User.findOne({ username: user.username }),
            User.findOne({ username: username })
        ]);

        if (!friendUser.request.to.includes(currentUser._id)) {
            return res.status(409).json({ message: 'Request not received' });
        }

        await Promise.all([
            currentUser.updateOne({ $pull: { 'request.from': friendUser._id } }),
            friendUser.updateOne({ $pull: { 'request.to': currentUser._id } })
        ]);

        res.status(200).json({ message: 'Friend request ignored' });
    } catch (error) {
        console.log('Error occurred while ignoring friend request:', error);
        res.status(500).json({ error });
    }
};

const cancelFriendRequest = async (req, res) => {
    try {
        const { username } = req.params;
        const { user } = req.body;

        const [currentUser, friendUser] = await Promise.all([
            User.findOne({ username: user.username }),
            User.findOne({ username: username })
        ]);

        if (!currentUser.request.to.includes(friendUser._id)) {
            return res.status(409).json({ message: 'Request not sent' });
        }

        await Promise.all([
            currentUser.updateOne({ $pull: { 'request.to': friendUser._id } }),
            friendUser.updateOne({ $pull: { 'request.from': currentUser._id } })
        ]);

        res.status(200).json({ message: 'Friend request cancelled' });
    } catch (error) {
        console.log('Error occurred while cancelling friend request:', error);
        res.status(500).json({ error });
    }
};

const getFriends = async (req, res) => {
    try {
        const { user } = req.body;

        const currentUser = User.findOne({ username: user.username });

        const friends = await User.find({ _id: { $in: currentUser.Friends } }).select('-password -accessTokens -request');

        res.status(200).json({ friends });

    } catch (error) {
        console.log('Error occurred while fetching friends:', error);
        res.status(500).json({ error });
    }
};

const getFriendRequests = async (req, res) => {
    try {
        const { user } = req.body;

        const currentUser = User.findOne({ username: user.username });

        const friendRequests = await User.find({ _id: { $in: currentUser.request.from } }).select('-password -accessTokens -request');

        res.status(200).json({ friendRequests });

    } catch (error) {
        console.log('Error occurred while fetching friend requests:', error);
        res.status(500).json({ error });
    }
};

const mutualFriends = async (req, res) => {
    try {
        const { username } = req.params;
        const { user } = req.body;

        const [currentUser, friendUser] = await Promise.all([
            User.findOne({ username: user.username }),
            User.findOne({ username: username })
        ]);

        const mutualFriends = currentUser.Friends.filter((friend) => friendUser.Friends.includes(friend));

        const mutualFriendsList = await User.find({ _id: { $in: mutualFriends } }).select('-password -accessTokens -request');

        return res.status(200).json({ mutualFriendsList });

    } catch (error) {
        console.log('Error occurred while fetching mutual friends:', error);
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
    acceptFriendRequest,
    unFriend,
    mutualFriends,
    ignoreFriendRequest,
    cancelFriendRequest,
    getFriends,
    getFriendRequests
};