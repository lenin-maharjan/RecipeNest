const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendError } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return sendError(res, 401, 'Not authorized, no token');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return sendError(res, 401, 'User no longer exists');
        }

        next();
    } catch (error) {
        sendError(res, 401, 'Not authorized, invalid token');
    }
};

module.exports = { protect };