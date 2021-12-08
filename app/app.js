/* eslint-disable max-len */
const express = require('express');
const mongoDB = require('./data-base/db-mongo');

const app = express();

//----------------------

//----------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// TODO error handling logic!!
// TODO separar todo en modulos
// TODO ver como sacar la base de datos de aca!!
// TODO fijate si necesitas .exec!!!!!!!
// TODO poner status code????

app.get('/', (req, res) => {
  res.send('Welcome to the dice Game!!!');
});

module.exports = app;
// TODO GET /players/ranking: devuelve el porcentaje medio de logros del conjunto de todos los jugadores
