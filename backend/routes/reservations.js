const express = require('express');
const router = express.Router();
const { isStaff, isLoggedIn } = require('../middlewares/authorization');
const BookSchema = require('../db/Schemas/BooksSchema');
const BookRequestsSchema = require('../db/Schemas/BookRequestsSchema');
const UserSchema = require('../db/Schemas/UserSchema'); // You were missing this import
const SysLogger = require('../middlewares/syslog');
// Function to parse requests
function requestsParsing(currentRequestedBooks) {
    const PendingRequests = [];
    const OngoingRequests = [];
    for (const book of currentRequestedBooks) {
        if (!book.isConfirmed) {
            PendingRequests.push(book);
        } else if (book.isConfirmed && !book.isRejected && !book.isReturned) {
            OngoingRequests.push(book);
        }
    }
    return { PendingRequests, OngoingRequests };
}

// Route to get reservations (admin only)
router.get('/reservations', async (req, res) => {
    try {
        const currentRequestedBooks = await BookRequestsSchema.find({ isReturned: false });

        const { PendingRequests, OngoingRequests } = requestsParsing(currentRequestedBooks);

        res.status(200).json({ PendingRequests, OngoingRequests });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/bookingHistory', async (req, res) => {
    try {
        const bookingHistory = await BookRequestsSchema.find({ isReturned: true });
        res.status(200).json({ bookingHistory });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Function to handle request updates
const handleRequest = async (RequestId, update) => {
    try {
        const requestData = await BookRequestsSchema.findOneAndUpdate({ _id: RequestId }, update);
        return requestData;
    } catch (error) {
        return null;
    }
};

// Route to accept a request (admin only)
router.post('/acceptRequest', async (req, res) => {
    const update = { isConfirmed: true, isRejected: false };
    const { RequestId } = req.body;

    const requestData = await handleRequest(RequestId, update);

    if (requestData) {
        try {
            const book = await BookSchema.findById(requestData.bookInfo.bookId);
            if (book.quantity > 0) {
                await BookSchema.updateOne({ _id: requestData.bookInfo.bookId }, { $inc: { quantity: -1 } });
                res.status(200).json({ message: 'Request accepted successfully' });
            } else {
                res.status(401).json({ error: 'Book not available' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(404).json({ error: 'Request not found' });
    }
});

// Route to reject a request (admin only)
router.post('/rejectRequest', async (req, res) => {
    const update = { isRejected: true, isConfirmed: true };
    const { RequestId } = req.body;

    let requestData = await handleRequest(RequestId, update);
    requestData.isRejected = true;
    if (requestData) {
        try {
            await UserSchema.updateOne({ _id: requestData.userInfo.userId }, { $push: { bookingHistory: requestData._id } });
            res.status(200).json({ message: 'Request rejected successfully' });
            await UserSchema.updateOne({ login: req.session.login }, { $pull: { bookingHistory: RequestId } });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(404).json({ error: 'Request not found' });
    }
});

// Route to return a book (admin only)
router.post('/bookReturned', async (req, res) => {
    try {
        const { RequestId } = req.body;
        const ongoingRequest = await BookRequestsSchema.findOneAndUpdate(
            { _id: RequestId },
            { isReturned: true, dayReturned: new Date().toISOString().split('T')[0] }
        );
        await BookSchema.updateOne({ _id: ongoingRequest.bookInfo.bookId }, { $inc: { quantity: 1 } });
        SysLogger.info(
            `Book ${ongoingRequest.bookInfo.bookISBN} that was reserved by ${ongoingRequest.userInfo.login} is set as returned by ${req.session.login}`
        );
        res.status(200).json({ message: 'Book returned successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
