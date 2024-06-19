import express from 'express';
import { registerUser, authUser, logoutUser } from '../controller/user.controller.js';
import { body } from 'express-validator';

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user registration, login, and logout
 */

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
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
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
 */
userRouter.post('/register', 
  [
    body('username').not().isEmpty().withMessage('Username is required').trim().escape(),
    body('email').isEmail().withMessage('Email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').trim().escape()
  ],
  registerUser
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user and get token
 *     tags: [Users]
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
 */
userRouter.post('/login',
  [
    body('email').isEmail().withMessage('Email is required').normalizeEmail(),
    body('password').not().isEmpty().withMessage('Password is required').trim().escape()
  ],
  authUser
);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Log out user and invalidate token
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Logged out successfully
 *       '400':
 *         description: No token provided or error logging out
 *       '500':
 *         description: Server error
 */
userRouter.post('/logout', logoutUser);

export {userRouter}
