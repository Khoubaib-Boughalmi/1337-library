const express = require('express');
const BookSchema = require('../db/Schemas/BooksSchema');
require('dotenv').config();

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        if (req.session.privilege == 'staff') {
            const books = await BookSchema.find();
            res.json(books).status(200);
        } else {
            const books = await BookSchema.find({ bookCampus: req.session.campusId });
            res.json(books).status(200);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching books' });
    }
});

module.exports = router;
