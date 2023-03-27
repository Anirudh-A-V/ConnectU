const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const sendFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req.body;

        const [currentUser, friend] = await Promise.all([
            User.findOne({ _id: user.id }),
            User.findOne({ _id: id })
        ]);

        if (friend.username === currentUser.username) {
            return res.status(409).json({ message: 'Cannot send friend request to yourself' });
        }

        if (currentUser.request.to.includes(friend._id)) {
            return res.status(409).json({ message: 'Request already sent' });
        }

        if (currentUser.request.from.includes(friend._id)) {
            return res.status(409).json({ message: 'Request already received' });
        }

        if (currentUser.Friends.includes(friend._id) || friend.Friends.includes(currentUser._id)) {
            return res.status(409).json({ message: 'User already added' });
        }

        await Promise.all([
            currentUser.updateOne({ $addToSet: { 'request.to': friend._id } }),
            friend.updateOne({ $addToSet: { 'request.from': currentUser._id } })
        ]);

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

        await Promise.all([
            currentUser.updateOne({ $inc: { noOfFriends: 1 } }),
            friendUser.updateOne({ $inc: { noOfFriends: 1 } })
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
        const { id } = req.params;
        const { user } = req.body;

        const [currentUser, friendUser] = await Promise.all([
            User.findOne({ username: user.username }),
            User.findOne({ _id: id })
        ]);

        if (!currentUser.Friends.includes(friendUser._id)) {
            return res.status(409).json({ message: 'User not added' });
        }

        await Promise.all([
            currentUser.updateOne({
                $pull: { Friends: friendUser._id },
                $inc: { noOfFriends: -1 }
            }),
            friendUser.updateOne({
                $pull: { Friends: currentUser._id },
                $inc: { noOfFriends: -1 }
            })
        ]);

        await Promise.all([currentUser.save(), friendUser.save()]);

        res.status(200).json({ message: 'User unfriended' });
    } catch (error) {
        console.log('Error occurred while unfriending user:', error);
        res.status(500).json({ error });
    }
};

const ignoreFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req.body;

        const [currentUser, friendUser] = await Promise.all([
            User.findOne({ username: user.username }),
            User.findOne({ _id: id })
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
        const { id } = req.params;
        const { user } = req.body;

        const [currentUser, friendUser] = await Promise.all([
            User.findOne({ username: user.username }),
            User.findOne({ _id: id })
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

        const currentUser = await User.findOne({ username: user.username });

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

        const currentUser = await User.findOne({ username: user.username });

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!currentUser.request.from.length) {
            return res.status(200).json({ friendRequests: [] });
        }

        const friendRequests = await User.find({ _id: { $in: currentUser.request.from } }, { _id:1, name: 1, username: 1, image: 1 }).select('-password -accessTokens -request');

        res.status(200).json({ friendRequests });

    } catch (error) {
        console.log('Error occurred while fetching friend requests:', error);
        res.status(500).json({ error });
    }
};

const mutualFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req.body;

        const [currentUser, friendUser] = await Promise.all([
            User.findOne({ username: user.username }),
            User.findOne({ _id: id })
        ]);

        const mutualFriends = await User.aggregate([
            { $match: { _id: { $in: currentUser.Friends } } },
            { $match: { _id: { $in: friendUser.Friends } } },
            { $project: { _id: 1, username: 1, name: 1, email: 1, image: 1, bio: 1 } }
        ]);

        return res.status(200).json({ mutualFriends });

    } catch (error) {
        console.log('Error occurred while fetching mutual friends:', error);
        res.status(500).json({ error });
    }
};


const isFriendOrRequestSent = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req.body;

        const [currentUser, friendUser] = await Promise.all([
            User.findOne({ username: user.username }),
            User.findOne({ _id: id })
        ]);

        if (currentUser.Friends.includes(friendUser._id)) {
            return res.status(200).json({ isFriend: true, isRequestSent: false, isRequestReceived: false });
        }

        if (currentUser.request.to.includes(friendUser._id)) {
            return res.status(200).json({ isFriend: false, isRequestSent: true, isRequestReceived: false });
        }

        if (currentUser.request.from.includes(friendUser._id)) {
            return res.status(200).json({ isFriend: false, isRequestSent: false, isRequestReceived: true });
        }

        res.status(200).json({ isFriend: false, isRequestSent: false, isRequestReceived: false });

    } catch (error) {
        console.log('Error occurred while checking friend status:', error);
        res.status(500).json({ error });
    }
};

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    unFriend,
    ignoreFriendRequest,
    cancelFriendRequest,
    getFriends,
    getFriendRequests,
    mutualFriends,
    isFriendOrRequestSent
};