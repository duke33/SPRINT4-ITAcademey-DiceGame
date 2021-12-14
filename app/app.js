/* eslint-disable import/no-dynamic-require */
/* eslint-disable max-len */
const express = require('express');
const { dbByEnv } = require('../config');

// const db = require(dbByEnv);
const { connectMongo } = require('./data-base/db-mongo');

const { connectSequelize } = require('./data-base/db-mySQL');

if (dbByEnv === 'mongo') { connectMongo(); } else if (dbByEnv === 'mySQL') {
  connectSequelize();
}

// TODO ver si esta es la forma correcta de hacerlo, sobre todo porque solamente haces un import y nada mas. Agregar error si lo mandan sin los parametros env
const app = express();
const playersRouter = require('./routes/player-router');
const loginRouter = require('./routes/login-router');
const authenticationRouter = require('./middleware/authenticate-jwt');
const { unknownEndpoint, errorHandler } = require('./middleware/error-handler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the dice Game!!!. Log-in on /login');
});

app.use('/', loginRouter);
app.use(authenticationRouter);
app.use('/players', playersRouter);
app.use(errorHandler, unknownEndpoint);
module.exports = app;

// TODO agregar los archivos de postman, contar que tiene el token guardado!
// TODO ver como coño esta implementado la forma que coje el esquema basado en ENV
// TODO borrar los logs

// TODO preguntar a alvaro si con postman puedo loguerame y para la siguiente request que el token quede pegado en la request
// TODO comprobar todas las rutas con el token puesto
