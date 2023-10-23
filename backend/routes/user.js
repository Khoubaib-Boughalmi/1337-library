const express = require('express');
const UserSchema = require('../db/Schemas/UserSchema');
const RequestedBooksSchema = require('../db/Schemas/BookRequestsSchema');
const router = express.Router();
const { isStaff, isLoggedIn } = require('../middlewares/authorization');

//get all users (staff only)
router.get('/getusers', isStaff, async (req, res) => {
    try {
        const users = await UserSchema.find({ campusId: req.session.campusId });
        res.send(users).status(200);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// get current user profile
router.get('/myprofile', async (req, res) => {
    try {
        const user = await UserSchema.findOne({ login: req.session.login });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.send(user).status(200);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// for users porifle data
router.get('/userprofile', async (req, res) => {
    try {
        const user = await UserSchema.findOne({ login: req.session.login });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userRequestsIds = user.bookingHistory;
        const userHistory = await RequestedBooksSchema.find({ _id: { $in: userRequestsIds } });
        res.send(userHistory).status(200);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching user' });
    }
});

// ban/unban user (staff only)
router.post('/banHandler', isStaff, async (req, res) => {
    try {
        const { userId, isBanned } = req.body;
        await UserSchema.findOneAndUpdate({ _id: userId }, { isBanned });
        res.status(200).json({ message: 'User banned successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
