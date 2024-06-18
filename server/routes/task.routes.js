const express = require('express');
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require('../controller/task.controller');
const { auth } = require('../middlewares/auth.middleware');
const taskRouter = express.Router();


taskRouter.post('/', auth, createTask);
taskRouter.get('/', auth, getAllTasks);
taskRouter.get('/:id', auth, getTaskById);
taskRouter.put('/:id', auth, updateTask);
taskRouter.delete('/:id', auth, deleteTask);

module.exports = taskRouter;
