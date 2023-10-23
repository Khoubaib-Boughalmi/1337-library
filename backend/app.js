const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/42auth');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const indexroute = require('./routes/index');
const reservations = require('./routes/reservations');
const { isStaff, isLoggedIn } = require('./middlewares/authorization');
const connectToDatabase = require('./db/db');
connectToDatabase();
require('dotenv').config();

const app = express();
const port = process.env.PORT || 1337;

const cors = require('cors');

app.use(
    cors({
        origin: true,
        credentials: true,
        optionsSuccessStatus: 200
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionConfig = {
    secret: process.env.SESSION_SECRET || '3H8as42fn92XKj13fQoP4YD17C6E5B',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 5, // 5h
        sameSite: 'lax'
    }
};

app.use(session(sessionConfig));
app.use('/api', authRoutes);
app.use('/api', isLoggedIn, bookRoutes);
app.use('/api', isLoggedIn, userRoutes);
app.use('/api', isLoggedIn, indexroute);
app.use('/api', isStaff, reservations);

app.listen(port, () => {});
