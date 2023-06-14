const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/connection');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const authRouter = require('../routers/auth');
const userRouter = require('../routers/user');
const projectRouter = require('../routers/project');
const taskRouter = require('../routers/task');

dbConnection();

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

module.exports = app;
