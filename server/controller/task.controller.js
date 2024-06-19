import asyncHandler from "express-async-handler";
import { Tasks } from "../models/task.schema.js";

const createTask = asyncHandler(async (req, res) => {
    try {
        const task = new Tasks({ ...req.body, user: req.user.id });
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

const getAllTasks = asyncHandler(async (req, res) => {
    try {
        const tasks = await Tasks.find({ user: req.user.id });
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

const getTaskById = asyncHandler(async (req, res) => {
    try {
        const task = await Tasks.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

const updateTask = asyncHandler(async (req, res) => {
    try {
        const task = await Tasks.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

const deleteTask = asyncHandler(async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).send({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

export {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};
