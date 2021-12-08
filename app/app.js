/* eslint-disable max-len */
const express = require('express');
const mongoDB = require('./data-base/db-mongo');
// TODO ver si esta es la forma correcta de hacerlo
const app = express();
const playersRouter = require('./routes/player-router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the dice Game!!!');
});
app.use('/players', playersRouter);

module.exports = app;
