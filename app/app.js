/* eslint-disable max-len */
const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');

const app = express();

//----------------------
const User = require('./user-schema');
const rollTheDice = require('./game');

const mongoDb = config.MONGODB_URI;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('connected', () => console.log('Db connected'));
db.on('error', console.error.bind(console, 'mongo connection error'));
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

// POST /players: crea un jugador
// TODO hacer que no se pueda repetir el nombre, a no ser que sea anonimo
app.post('/players', async (req, res) => {
  const newPlayer = new User({
    name: req.body.name,
  });

  try {
    await newPlayer.save();
    res.send(newPlayer);
  } catch (err) { res.send(err); }
});

// PUT /players: modifica el nombre del jugador
app.put('/players/:playerId', async (req, res) => {
  const { playerId } = req.params;
  const { newName } = req.body;
  try {
    const updatedPlayer = await User.findByIdAndUpdate(playerId, { name: newName }, { new: true });
    res.send(updatedPlayer);
  } catch (err) { res.send(err); }
});

// DELETE /players/{id}/games: elimina las tiradas del jugador //TODO cambiar lo que devuelve
app.delete('/players/:playerId/games', async (req, res) => {
  const { playerId } = req.params;
  try {
    const foundUser = await User.findById(playerId).exec();
    foundUser.gameLog = [];
    // TODO ver si esto lo pones como undefined
    foundUser.successRate = 0;
    await foundUser.save();
    res.send(foundUser);
  } catch (err) { res.send(err); }
});

// POST /players/{id}/games: un jugador específico realiza un tirón

app.post('/players/:playerId/games', async (req, res) => {
  const { playerId } = req.params;

  const result = rollTheDice();
  try {
    const foundPlayer = await User.findById(playerId).exec();
    foundPlayer.gameLog.push(result);
    foundPlayer.successRate = foundPlayer.successRateCalc();
    await foundPlayer.save();
    res.send({ result });
  } catch (err) { res.send(err); }
});

// GET /players/{id}/games: devuelve el listado de jugadas por un jugador.
app.get('/players/:playerId/games', async (req, res) => {
  const { playerId } = req.params;
  try {
    const foundPlayer = await User.findById(playerId).exec();
    res.send(foundPlayer.gameLog);
  } catch (err) { res.send(err); }
});

// Devuelve el porcentaje de exito de un jugardor especifico
app.get('/players/:playerId/games/rate', async (req, res) => {
  const { playerId } = req.params;
  try {
    const foundPlayer = await User.findById(playerId).exec();
    res.json(foundPlayer.successRate);
  } catch (err) { res.send(err); }
});

// GET /players: devuelve el listado de todos los jugadores del sistema con su porcentaje medio de logros
app.get('/players', async (req, res) => {
  try {
    const allPlayers = await User.find({}, 'name successRate').exec();
    res.json(allPlayers);
  } catch (err) { res.send(err); }
});

// GET /players/ranking/winner: devuelve al jugador con mejor porcentaje de éxito
app.get('/players/ranking/winner', async (req, res) => {
  try {
    const winnerPlayer = await User.findOne({}).sort('-successRate').exec();
    res.json(winnerPlayer);
  } catch (err) { res.send(err); }
});

// GET /players/ranking/loser: devuelve al jugador con peor porcentaje de éxito
app.get('/players/ranking/loser', async (req, res) => {
  try {
    const winnerPlayer = await User.findOne({}).sort('successRate').exec();
    res.json(winnerPlayer);
  } catch (err) { res.send(err); }
});

module.exports = app;
// GET /players/ranking: devuelve el porcentaje medio de logros del conjunto de todos los jugadores
