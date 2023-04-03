const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const postSchema = mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User',
    },
    images: {
        type: [String],
        required: false,
    },
    caption: {
        type: String,
        required: true,
    },
    likes: {
        type: [ObjectId],
        required: false,
    },
    noOfLikes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: [{
            user: {
                type: ObjectId,
                ref: 'User',
            },
            comment: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }],
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Post', postSchema);