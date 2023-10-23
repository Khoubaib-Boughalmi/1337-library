function isStaff(req, res, next) {
    if (req.session.privilege === 'staff') {
        next();
    } else {
        res.status(403).json({ error: 'You are not allowed' });
    }
}

function isLoggedIn(req, res, next) {
    if (req.session?.login) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = {
    isStaff,
    isLoggedIn
};
