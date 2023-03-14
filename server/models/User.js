const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = mongoose.Schema({
    name: {
        first: {
            type: String,
            required: true,
        },
        last: {
            type: String,
            required: true,
        },
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    bio : {
        type: String,
        default: 'No bio provided yet',
    },
    noOfFriends: {
        type: Number,
        default: 0,
    },
    noOfPosts: {
        type: Number,
        default: 0,
    },
    Friends : {
        type: [ObjectId],
        required: false,
    },
    Posts : {
        type: [ObjectId],
        required: false,
    },
    request: {
        to : {
            type: [ObjectId],
            required: false,
        },
        from : {
            type: [ObjectId],
            required: false,
        },
    },
    accessTokens : {
        type: [String],
        required: false,
    },
});

module.exports = mongoose.model('User', userSchema);