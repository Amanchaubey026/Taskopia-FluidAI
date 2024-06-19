import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User } from '../models/user.schema.js'; 
import Blacklist from '../models/blacklist.schema.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const auth = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Check if token is in blacklist
    const blacklistedToken = await Blacklist.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ msg: 'Token is blacklisted, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
});
