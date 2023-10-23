const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        login: {
            type: String,
            required: true
        },
        state: {
            type: String,
            enum: ['staff', 'student']
        },
        bookingHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'RequestedBooks'
            }
        ],
        favBooks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book'
            }
        ],
        profilePicture: {
            type: String,
            required: true
        },
        campusId: {
            type: Number,
            required: true,
            enum: [55, 21, 16]
        },
        isBanned: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
