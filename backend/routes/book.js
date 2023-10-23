const express = require('express');
const router = express.Router();
const { isStaff, isLoggedIn } = require('../middlewares/authorization');
const BookSchema = require('../db/Schemas/BooksSchema');
const UserSchema = require('../db/Schemas/UserSchema');
const BookRequestsSchema = require('../db/Schemas/BookRequestsSchema');
const axios = require('axios');
const SysLogger = require('../middlewares/syslog');

//Create a new book
router.post('/addNewBook', isLoggedIn, async (req, res) => {
    try {
        let { bookISBN, bookName, quantity, category, summary, bookCover, author, owner } = req.body;
        const bookCampus = req.session.campusId;

        let newBook = new BookSchema({ bookISBN, bookName, quantity, category, bookCampus, summary, bookCover, author, owner });
        await newBook.save();
        SysLogger.info(`New book created: ${bookISBN} by ${req.session.login}`);
        res.status(201).json({ message: 'New book created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Update a book
router.post('/updateBook/:bookId', isStaff, async (req, res) => {
    try {
        const { bookId } = req.params;
        const { bookISBN, bookName, quantity, category, author, summary, bookCover } = req.body;
        console.log(category);
        const update = { bookISBN, bookName, quantity, category, author, summary, bookCover };
        const updatedBook = await BookSchema.findByIdAndUpdate({ _id: bookId }, update, { new: false });
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        SysLogger.info(`Book updated: ${bookISBN} by ${req.session.login}`);
        res.status(200).json({ message: 'Book updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Delete a book
router.delete('/deleteBook/:bookId', isStaff, async (req, res) => {
    try {
        const { bookId } = req.params;
        const delBook = await BookSchema.findOneAndDelete({ _id: bookId });
        SysLogger.info(`Book ${delBook.bookISBN} was deleted by ${req.session.login}`);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Request a book from library
router.post('/requestbook', async (req, res) => {
    const { bookId, returnDate } = req.body;
    try {
        const book = await BookSchema.findById(bookId);
        if (!book) {
            return res.status(401).json({ error: 'book not found' });
        }
        if (book.quantity < 1) {
            return res.status(401).json({ error: 'book not available' });
        }
        const requestedBook = new BookRequestsSchema({
            bookInfo: {
                bookId: book._id,
                bookISBN: book.bookISBN,
                bookName: book.bookName,
                bookCover: book.bookCover,
                category: book.category,
                author: book.author,
                owner: book.owner
            },
            userInfo: {
                userId: req.session.userId,
                login: req.session.login,
                campusId: req.session.campusId,
                profilePicture: req.session.image,
                state: req.session.privilege
            },
            returningDay: returnDate.split('T')[0]
        });
        await requestedBook.save();
        await UserSchema.updateOne({ login: req.session.login }, { $push: { bookingHistory: requestedBook._id } });
        res.status(201).json({ message: 'Book request created successfully' });

        let campus = 'other';
        switch (req.session.campusId) {
            case 16:
                campus = 'Khouribga';
                break;
            case 21:
                campus = 'Ben-guerro';
                break;
            case 55:
                campus = 'Tetouan';
                break;
        }

        const data = {
            content: `A book has been requested by ${req.session.login}!\n Campus: ${campus}`,
            embeds: [
                {
                    title: `${book.bookName}`,
                    url: `${process.env.FRONTEND_URL}/staff/reservations`,
                    color: 16711680,
                    fields: [
                        {
                            name: 'Quantity',
                            value: `${book.quantity}`
                        },
                        {
                            name: 'Book ISBN',
                            value: `${book.bookISBN}`
                        },
                        {
                            name: 'Book Owner',
                            value: `${book.owner}`
                        }
                    ],
                    thumbnail: {
                        url: `${book.bookCover}`
                    },

                    timestamp: new Date(),
                    footer: {
                        text: 'requested by ' + req.session.login,
                        icon_url: `${req.session.image}`
                    }
                }
            ]
        };

        await axios.post(process.env.DISCORD_WEBHOOK, data);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/setFavourite', isLoggedIn, async (req, res) => {
    try {
        const { bookId } = req.body;
        await UserSchema.updateOne({ _id: req.session.userId }, { $push: { favBooks: bookId } });
        res.status(200).json({ message: 'Book added to favourites successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/removeFavourite', isLoggedIn, async (req, res) => {
    try {
        const { bookId } = req.body;
        await UserSchema.updateOne({ _id: req.session.userId }, { $pull: { favBooks: bookId } });
        res.status(200).json({ message: 'Book removed from favourites successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
