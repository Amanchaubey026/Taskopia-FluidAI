import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { userRouter } from './routes/user.routes.js';
import { connectionToDB } from './config/db.config.js';
import { notFound, errorHandler } from './middlewares/errorHandler.middleware.js';
import taskRouter from './routes/task.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TASKOPIA-FLUIDAI',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.SERVER_URL || `http://localhost:${PORT}` 
      }
    ]
  },
  apis: ['./routes/*.js'], 
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true 
  }
}));

app.get('/', (req, res) => {
  res.send("server up!");
});

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, async () => {
  try {
    await connectionToDB();
    console.log(`Server running on port http://localhost:${PORT}`.yellow.bold);
  } catch (error) {
    console.log(error);
  }
});

export { app };
