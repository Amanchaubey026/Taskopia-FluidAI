import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { app } from '../index.js'; // Adjust path as needed
import { User } from '../models/user.schema.js';
import { Task } from '../models/task.schema.js';

// Hardcoded JWT secret (for demonstration purposes, use environment variables in production)
const JWT_SECRET = 'your_jwt_secret';

describe('User API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.msg).toBe('User registered successfully');
    });

    it('should not register a user with an existing email', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userId = new mongoose.Types.ObjectId();

      const user = new User({
        _id: userId,
        username: 'testuser',
        email: 'testuser@example.com',
        password: hashedPassword,
      });
      await user.save();

      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser2',
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('User already exists');
    });
  });

  describe('POST /api/users/login', () => {
    it('should authenticate a user and return a token', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userId = new mongoose.Types.ObjectId();

      const user = new User({
        _id: userId,
        username: 'testuser',
        email: 'testuser@example.com',
        password: hashedPassword,
      });
      await user.save();

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not authenticate a user with invalid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userId = new mongoose.Types.ObjectId();

      const user = new User({
        _id: userId,
        username: 'testuser',
        email: 'testuser@example.com',
        password: hashedPassword,
      });
      await user.save();

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe('Invalid credentials');
    });
  });

  describe('POST /api/users/logout', () => {
    it('should log out a user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userId = new mongoose.Types.ObjectId();

      const user = new User({
        _id: userId,
        username: 'testuser',
        email: 'testuser@example.com',
        password: hashedPassword,
      });
      await user.save();

      const loginRes = await request(app)
        .post('/api/users/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      const token = loginRes.body.token;

      const logoutRes = await request(app)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.msg).toBe('Logged out successfully');
    });

    it('should return an error if no token is provided', async () => {
      const res = await request(app)
        .post('/api/users/logout');

      expect(res.status).toBe(400); // Change to 400 if that's what your API returns
      expect(res.body.msg).toBe('No token provided');
    });
  });
});

describe('Task API', () => {
  let authToken;
  let userId;
  let taskId; // Variable to store generated task ID

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash('password123', 10);
    userId = new mongoose.Types.ObjectId();

    const user = new User({
      _id: userId,
      username: 'testuser',
      email: 'testuser@example.com',
      password: hashedPassword,
    });
    await user.save();

    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2024-06-25T12:00:00.000Z',
        priority: 'High',
        status: 'Pending',
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ ...taskData, user: userId.toString() });

      // Store the created task ID
      taskId = res.body._id;
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidTaskData = {
        description: 'This is a test task without a title',
        dueDate: '2024-06-25T12:00:00.000Z',
        priority: 'High',
        status: 'Pending',
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTaskData);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should get a single task by id', async () => {
      const res = await request(app)
        .get(`/api/tasks/${taskId}`) 
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(taskId); 
    });

    it('should return 404 if task is not found', async () => {
      const nonExistingTaskId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/tasks/${nonExistingTaskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body.msg).toBe('Task not found');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTaskData = {
        title: 'Updated Task',
        description: 'This is an updated test task',
        dueDate: '2024-06-26T12:00:00Z',
        priority: 'Medium',
        status: 'InProgress',
      };

      const res = await request(app)
        .put(`/api/tasks/${taskId}`) // Use the stored taskId here
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedTaskData);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(updatedTaskData);
    });

    it('should return 404 if task is not found', async () => {
      const nonExistingTaskId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/tasks/${nonExistingTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
          description: 'This is an updated test task',
          dueDate: '2024-06-26T12:00:00Z',
          priority: 'Medium',
          status: 'InProgress',
        });

      expect(res.status).toBe(404);
      expect(res.body.msg).toBe('Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`) // Use the stored taskId here
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.msg).toBe('Task deleted successfully');
    });

    it('should return 404 if task is not found', async () => {
      const nonExistingTaskId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/tasks/${nonExistingTaskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body.msg).toBe('Task not found');
    });
  });
});
