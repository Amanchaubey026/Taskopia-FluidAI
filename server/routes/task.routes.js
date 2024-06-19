import express from 'express';
import { body, param } from 'express-validator';
import { 
    createTask, 
    getAllTasks, 
    getTaskById, 
    updateTask, 
    deleteTask 
} from '../controller/task.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const taskRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API endpoints for managing tasks
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *         status:
 *           type: string
 *           enum: [Pending, In-Progress, Completed]
 *         user:
 *           type: string
 *
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               status:
 *                 type: string
 *                 enum: [Pending, In-Progress, Completed]
 *     responses:
 *       '201':
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '400':
 *         description: Validation error or bad request
 *       '500':
 *         description: Server error
 */
taskRouter.post('/', 
  auth,
  [
    body('title').not().isEmpty().withMessage('Task title is required').trim().escape(),
    body('description').optional().trim().escape(),
    body('dueDate').optional().isISO8601().toDate().withMessage('Invalid date format'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority level'),
    body('status').optional().isIn(['Pending', 'In-Progress', 'Completed']).withMessage('Invalid status')
  ],
  createTask
);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       '500':
 *         description: Server error
 */
taskRouter.get('/', auth, getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A single task object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Task not found
 *       '500':
 *         description: Server error
 */
taskRouter.get('/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Invalid task ID')
  ],
  getTaskById
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               status:
 *                 type: string
 *                 enum: [Pending, In-Progress, Completed]
 *     responses:
 *       '200':
 *         description: Updated task object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '400':
 *         description: Validation error or bad request
 *       '404':
 *         description: Task not found
 *       '500':
 *         description: Server error
 */
taskRouter.put('/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').not().isEmpty().withMessage('Task title is required').trim().escape(),
    body('description').optional().trim().escape(),
    body('dueDate').optional().isISO8601().toDate().withMessage('Invalid date format'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority level'),
    body('status').optional().isIn(['Pending', 'In-Progress', 'Completed']).withMessage('Invalid status')
  ],
  updateTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Task deleted successfully
 *       '404':
 *         description: Task not found
 *       '500':
 *         description: Server error
 */
taskRouter.delete('/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Invalid task ID')
  ],
  deleteTask
);

export default taskRouter; 

