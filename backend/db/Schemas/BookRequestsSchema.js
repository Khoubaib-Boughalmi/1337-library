const mongoose = require('mongoose');

const BookRequestsSchema = new mongoose.Schema(
    {
        bookInfo: {
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
            bookISBN: { type: String, required: true },
            bookName: { type: String, required: true },
            category: { type: [String], required: true },
            bookCover: { type: String, required: true },
            author: { type: String, required: true },
            owner: { type: String, required: true }
        },
        userInfo: {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            login: { type: String, required: true },
            state: { type: String, enum: ['staff', 'student'] },
            profilePicture: { type: String, required: true },
            campusId: { type: Number, required: true }
        },
        requestDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
        dayReturned: { type: String },
        returningDay: { type: String, required: true },
        isConfirmed: { type: Boolean, default: false },
        isReturned: { type: Boolean, default: false },
        isRejected: { type: Boolean, default: false },
        note: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const RequestedBooksSchema = mongoose.model('RequestedBooks', BookRequestsSchema);

module.exports = RequestedBooksSchema;
