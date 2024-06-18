const express = require('express');
const app = express();
const colors = require('colors');
require("dotenv").config();
const cors = require("cors");
const { userRouter } = require('./routes/user.routes');
const { connectionToDB } = require('./config/db.config');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { notFound, errorHandler } = require('./middlewares/errorHandler.middleware');
const taskRouter = require('./routes/task.routes');
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true } 
}));

app.get('/', (req, res) => {
  res.send("server up!")
});

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    await connectionToDB();
    console.log(`server running on port http://localhost:${PORT}`.yellow.bold);
  } catch (error) {
    console.log(error);
  }
});