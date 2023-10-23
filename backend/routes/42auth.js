const express = require('express');
const axios = require('axios');
const UserSchema = require('../db/Schemas/UserSchema');
require('dotenv').config();
const SysLogger = require('../middlewares/syslog');
const router = express.Router();

router.get('/auth/42', (req, res) => {
    res.redirect(
        `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.clientID}&redirect_uri=${process.env.redURI}&response_type=code`
    );
});

router.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    try {
        const response = await axios.post('https://api.intra.42.fr/oauth/token', {
            grant_type: 'authorization_code',
            client_id: process.env.clientID,
            client_secret: process.env.clientSecret,
            code: code,
            redirect_uri: process.env.redURI
        });

        const accessToken = response.data.access_token;

        req.session.login = true;

        const userInfo = await axios.get('https://api.intra.42.fr/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const login = userInfo.data.login;
        const state = userInfo.data['staff?'] ? 'staff' : 'student';
        const profilePicture = userInfo.data.image.link;
        let campusId = 0;

        for (const campus of userInfo.data.campus_users) if (campus.is_primary) campusId = campus.campus_id;

        const existingUser = await UserSchema.findOne({ login });

        if (existingUser) {
            if (existingUser.isBanned) {
                res.status(401).redirect(process.env.FRONTEND_URL + '/');
            }
            req.session.userId = existingUser._id;
            await UserSchema.updateOne({ login }, { profilePicture, campusId });
        } else {
            const newUser = new UserSchema({ login, campusId, state, profilePicture });
            await newUser.save();
            req.session.userId = newUser._id;
        }

        req.session.privilege = state;
        req.session.campusId = campusId;
        req.session.login = login;
        req.session.image = profilePicture;
        SysLogger.info(`User ${login} logged in`);
        res.redirect(process.env.FRONTEND_URL + '/home');
    } catch (error) {
        res.status(500).redirect(process.env.FRONTEND_URL + '/');
    }
});

router.get('/logout', (req, res) => {
    try {
        res.clearCookie('connect.sid');
    } catch (error) {
    }
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send('Error logging out');
        }
        res.status(200).redirect(process.env.FRONTEND_URL + '/');
    });
});

module.exports = router;
