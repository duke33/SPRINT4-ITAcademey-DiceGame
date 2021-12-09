/* eslint-disable max-len */
const User = require('../schemas/user-schema-mongo');
const rollTheDice = require('../helpers/game');
// TODO error handling logic try catch!!
// TODO fijate si necesitas .exec!!!!!!!
// TODO poner status code????

// Crea un jugador
const createUser = async (req, res) => {
  const { name } = req.body;
  const previousUser = await User.find({ name }).exec();

  console.log('condition1', !(previousUser.length === 0));
  console.log('condition2', !(name === undefined));

  if (!(previousUser.length === 0) && !(name === undefined)) { res.status(409).send({ error: 'Duplicated Username' }); } else {
    const newPlayer = new User({
      name,
    });

    try {
      await newPlayer.save();
      res.send(newPlayer);
    } catch (err) { res.send(err); }
  }
};

// Modifica el nombre del jugador
const modifyPlayerName = async (req, res) => {
  const { playerId } = req.params;
  const { newName } = req.body;
  try {
    const updatedPlayer = await User.findByIdAndUpdate(playerId, { name: newName }, { new: true });
    res.send(updatedPlayer);
  } catch (err) { res.send(err); }
};

// Elimina las tiradas del jugador
const cleanGameLog = async (req, res) => {
  const { playerId } = req.params;
  try {
    const foundUser = await User.findById(playerId).exec();
    foundUser.gameLog = null;
    foundUser.successRate = null;
    await foundUser.save();
    res.send('Game Log erased');
  } catch (err) { res.send(err); }
};

// Un jugador específico realiza un tirón

const makeAPlay = async (req, res) => {
  const { playerId } = req.params;

  const result = rollTheDice();
  try {
    const foundPlayer = await User.findById(playerId).exec();
    foundPlayer.gameLog.push(result);
    foundPlayer.successRate = foundPlayer.successRateCalc();
    await foundPlayer.save();
    res.send({ result });
  } catch (err) { res.send(err); }
};

// Devuelve el listado de jugadas por un jugador.
const playersList = async (req, res) => {
  const { playerId } = req.params;
  try {
    const foundPlayer = await User.findById(playerId).exec();
    res.send(foundPlayer.gameLog);
  } catch (err) { res.send(err); }
};

// Devuelve el porcentaje de exito de un jugardor especifico
const individualPlayerSuccessRate = async (req, res) => {
  const { playerId } = req.params;
  try {
    const foundPlayer = await User.findById(playerId).exec();
    res.json(foundPlayer.successRate);
  } catch (err) { res.send(err); }
};

// Devuelve el listado de todos los jugadores del sistema con su porcentaje medio de logros
const playersAndSuccessRateList = async (req, res) => {
  try {
    const allPlayers = await User.find({}, 'name successRate').exec();
    res.json(allPlayers);
  } catch (err) { res.send(err); }
};

// GET /players/ranking/winner: devuelve al jugador con mejor porcentaje de éxito
const winner = async (req, res) => {
  try {
    const winnerPlayer = await User.findOne({}).sort('-successRate').exec();
    res.json(winnerPlayer);
  } catch (err) { res.send(err); }
};

// GET /players/ranking/loser: devuelve al jugador con peor porcentaje de éxito
const looser = async (req, res) => {
  try {
    const winnerPlayer = await User.findOne({}).sort('successRate').exec();
    res.json(winnerPlayer);
  } catch (err) { res.send(err); }
};

// GET /players/ranking: devuelve el porcentaje medio de logros del conjunto de todos los jugadores
const successRateAvg = async (req, res) => {
  console.log('entra');
  const globalAvgSuccessRate = await User.aggregate(
    [{
      $match: {
        successRate: {
          $ne: null,
        },
      },
    },
    {
      $group:
             {
               _id: '_id',
               successRateAvg: { $avg: '$successRate' },
             },
    },
    ],
  );

  console.log('globalAvgSuccesRate:', globalAvgSuccessRate);
  res.json(globalAvgSuccessRate[0].successRateAvg);
};

module.exports = {
  createUser, modifyPlayerName, cleanGameLog, makeAPlay, playersList, individualPlayerSuccessRate, playersAndSuccessRateList, winner, looser, successRateAvg,
};
