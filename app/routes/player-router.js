/* eslint-disable max-len */
const express = require('express');

const router = express.Router();
const User = require('../user-schema');
const rollTheDice = require('../game');

// POST /players: crea un jugador
// TODO hacer que no se pueda repetir el nombre, a no ser que sea anonimo
router.post('/players', async (req, res) => {
  const newPlayer = new User({
    name: req.body.name,
  });

  try {
    await newPlayer.save();
    res.send(newPlayer);
  } catch (err) { res.send(err); }
});

// PUT /players: modifica el nombre del jugador
router.put('/players/:playerId', async (req, res) => {
  const { playerId } = req.params;
  const { newName } = req.body;
  try {
    const updatedPlayer = await User.findByIdAndUpdate(playerId, { name: newName }, { new: true });
    res.send(updatedPlayer);
  } catch (err) { res.send(err); }
});

// DELETE /players/{id}/games: elimina las tiradas del jugador //TODO cambiar lo que devuelve
router.delete('/players/:playerId/games', async (req, res) => {
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

router.post('/players/:playerId/games', async (req, res) => {
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
router.get('/players/:playerId/games', async (req, res) => {
  const { playerId } = req.params;
  try {
    const foundPlayer = await User.findById(playerId).exec();
    res.send(foundPlayer.gameLog);
  } catch (err) { res.send(err); }
});

// Devuelve el porcentaje de exito de un jugardor especifico
router.get('/players/:playerId/games/rate', async (req, res) => {
  const { playerId } = req.params;
  try {
    const foundPlayer = await User.findById(playerId).exec();
    res.json(foundPlayer.successRate);
  } catch (err) { res.send(err); }
});

// GET /players: devuelve el listado de todos los jugadores del sistema con su porcentaje medio de logros
router.get('/players', async (req, res) => {
  try {
    const allPlayers = await User.find({}, 'name successRate').exec();
    res.json(allPlayers);
  } catch (err) { res.send(err); }
});

// GET /players/ranking/winner: devuelve al jugador con mejor porcentaje de éxito
router.get('/players/ranking/winner', async (req, res) => {
  try {
    const winnerPlayer = await User.findOne({}).sort('-successRate').exec();
    res.json(winnerPlayer);
  } catch (err) { res.send(err); }
});

// GET /players/ranking/loser: devuelve al jugador con peor porcentaje de éxito
router.get('/players/ranking/loser', async (req, res) => {
  try {
    const winnerPlayer = await User.findOne({}).sort('successRate').exec();
    res.json(winnerPlayer);
  } catch (err) { res.send(err); }
});
