/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         pic:
 *           type: string
 *
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               pic:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Validation error or user already exists
 *       '500':
 *         description: Server error
 *
 * /api/users/login:
 *   post:
 *     summary: Authenticate user and get token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Authentication successful, returns token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '400':
 *         description: Invalid credentials or missing fields
 *       '500':
 *         description: Server error
 *
 * /api/users/logout:
 *   post:
 *     summary: Log out user and invalidate token
 *     responses:
 *       '200':
 *         description: Logged out successfully
 *       '400':
 *         description: No token provided or error logging out
 *       '500':
 *         description: Server error
 */
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.schema.js';
import { validationResult } from 'express-validator';
import Blacklist from '../models/blacklist.schema.js';
import dotenv from 'dotenv';

dotenv.config();


const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, pic } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      username,
      email,
      password: hashedPassword,
      pic
    });

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        pic: user.pic
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '4h' },
      (err, token) => {
        if (err) throw err;
        req.session.userId = user.id;
        res.cookie('token', token, { httpOnly: true });
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const blacklistedToken = new Blacklist({ token });
      await blacklistedToken.save();
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ msg: 'Unable to log out' });
        } else {
          res.clearCookie('token');
          res.status(200).json({ msg: 'Logged out successfully' });
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Unable to log out' });
    }
  } else {
    res.status(400).json({ msg: 'No token provided' });
  }
});

export{
  registerUser,
  authUser,
  logoutUser
};
