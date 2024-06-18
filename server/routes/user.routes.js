const express = require('express');
const { registerUser, authUser, logoutUser } = require('../controller/user.controller');
const { body } = require('express-validator');

const userRouter = express.Router();

const SignupValidation = [
  body('username').not().isEmpty().withMessage('Username is required').trim().escape(),
  body('email').isEmail().withMessage('Email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').trim().escape()
];

const LoginValidation = [
  body('email').isEmail().withMessage('Email is required').normalizeEmail(),
  body('password').not().isEmpty().withMessage('Password is required').trim().escape()
];

userRouter.post('/signup', SignupValidation, registerUser);
userRouter.post('/login', LoginValidation, authUser);
userRouter.post('/logout', logoutUser);

module.exports = {
  userRouter
};
