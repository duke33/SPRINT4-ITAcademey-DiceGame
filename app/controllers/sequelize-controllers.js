/* eslint-disable max-len */
const { Sequelize } = require('sequelize');

const { Op } = Sequelize;
const User = require('../schemas/user-model-mysql');
const Match = require('../schemas/match-model-mysql');
// TODO incluir los archivos de postman
const rollTheDice = require('../helpers/game');
// TODO borrar gamelog que aparece en la base de datos!!
// TODO pasar los errores a next
// TODO borrar todos los console.log de este archivo!!!
// Crea un jugador
const createUser = async (req, res, next) => {
  const { name } = req.body;
  try {
    // Un workaround, porque mysql no puede hacer busquedas con where undefined
    const previousUser = (name === undefined) ? [] : await User.findAll({
      where: {
        name,
      },

    });

    if (!(previousUser.length === 0) && !(name === undefined)) { res.status(409).send({ error: 'Duplicated Username' }); } else {
      const newUser = await User.create({
        name,
      });
      res.json(newUser);
    }
  } catch (err) { console.log(err); }
};

// Modifica el nombre del jugador
const modifyPlayerName = async (req, res, next) => {
  const { playerId } = req.params;
  const { newName } = req.body;

  try {
    // first I have to make sure that the name selected is not already in use, since names can not be duplicated
    const previousUser = await User.findOne({ where: { name: newName } });
    if (previousUser
    ) { res.status(409).send({ error: 'Duplicated Username' }); return; }

    const updatedPlayer = await User.findByPk(playerId);
    if (!updatedPlayer) {
      throw new Error('User not found');
    }
    updatedPlayer.name = newName;
    await updatedPlayer.save();

    res.send(updatedPlayer);
  } catch (err) { console.log(err); }
};

// Elimina las tiradas del jugador //TODO aca actualizar el rate del jugador cuando se elimine todo!!
const cleanGameLog = async (req, res, next) => {
  //  await foo.setBar(null); // Un-associate ????

  const { playerId } = req.params;
  try {
    const foundUser = await User.findByPk(playerId);

    if (!foundUser) {
      throw new Error('User not found');
    } else {
      await Match.destroy({
        where: { userId: playerId },
        // truncate: true, //TODO ver que es esto
      });
      foundUser.successRate = null;
      await foundUser.save();

      res.send('Game Log erased');
    }
  } catch (err) { console.log(err); }
};

// Un jugador específico realiza un tirón

const makeAPlay = async (req, res, next) => {
  const { playerId } = req.params;

  const { dice1, dice2, gameWon } = rollTheDice();
  try {
    const foundPlayer = await User.findByPk(playerId);
    if (!foundPlayer) {
      throw new Error('User not found');
    }

    const currentMatch = await Match.create({
      dice1,
      dice2,
      gameWon,
      userId: playerId,
    });

    // eslint-disable-next-line no-use-before-define
    calculateAndUpdateSuccessRate(foundPlayer);
    res.send({ currentMatch });
  } catch (err) { console.log(err); }
};

// Devuelve el listado de jugadas por un jugador.
const playersList = async (req, res, next) => {
  const { playerId } = req.params;
  try {
    const matches = await Match.findAll({
      where: { UserId: playerId },
      // truncate: true,
    });
    console.log('la longitud del array:', matches.length);
    // if (!foundPlayer) {
    //   throw new Error('User not found');
    // }
    res.send(matches);
  } catch (err) { next(err); }
};

// Devuelve el porcentaje de exito de un jugardor especifico
const individualPlayerSuccessRate = async (req, res, next) => {
  const { playerId } = req.params;
  try {
    const foundPlayer = await User.findByPk(playerId);
    if (!foundPlayer) {
      throw new Error('User not found');
    }
    res.json(foundPlayer.successRate);
  } catch (err) { next(err); }
};

// Devuelve el listado de todos los jugadores del sistema con su porcentaje medio de logros
const playersAndSuccessRateList = async (req, res, next) => {
  try {
    const list = await User.findAll({
      attributes: ['name', 'successRate'],
    });
    res.json(list);
  } catch (err) { next(err); }
};

// GET /players/ranking/winner: devuelve al jugador con mejor porcentaje de éxito
const winner = async (req, res, next) => {
  try {
    const winnerPlayer = await User.findOne({ attributes: ['name', 'successRate'], order: [['successRate', 'DESC']], where: { successRate: { [Op.ne]: null } } });

    console.log('************winnerPlayer: ', winnerPlayer);

    res.json(winnerPlayer);
  } catch (err) { console.log(err); }
};

// GET /players/ranking/loser: devuelve al jugador con peor porcentaje de éxito
const looser = async (req, res, next) => {
  try {
    const winnerPlayer = await User.findOne({ attributes: ['name', 'successRate'], order: [['successRate']], where: { successRate: { [Op.ne]: null } } });

    res.json(winnerPlayer);
  } catch (err) { console.log(err); }
};

// GET /players/ranking: devuelve el porcentaje medio de logros del conjunto de todos los jugadores
const successRateAvg = async (req, res, next) => {
  try {
    const avg = await User.findAll({
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('successRate')), 'avgSuccessRate'],
      ],

    });
    console.log('avg:::******', avg);
    res.json(avg);
  } catch (err) { next(err); }
};

async function calculateAndUpdateSuccessRate(player) {
  const totalMatches = await Match.count({
    where: {
      userId: player.id,

    },
  });
  const wonMatches = await Match.count({
    where: {
      gameWon: true,
      userId: player.id,

    },
  });
  // TODO borrar todos estos console.log
  console.log('wonMatches', wonMatches);
  console.log('totalMatches', totalMatches);
  const successRate = wonMatches / totalMatches;
  console.log('successRate', successRate);
  // eslint-disable-next-line no-param-reassign
  player.successRate = successRate * 100;
  await player.save();
}

module.exports = {
  createUser, modifyPlayerName, cleanGameLog, makeAPlay, playersList, individualPlayerSuccessRate, playersAndSuccessRateList, winner, looser, successRateAvg,
};
