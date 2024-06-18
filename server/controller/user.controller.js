const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require("../models/user.schema");
const { validationResult } = require('express-validator');
const Blacklist = require("../models/blacklist.schema");
require('dotenv').config();

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

module.exports = {
  registerUser,
  authUser,
  logoutUser
};
