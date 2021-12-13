const { Sequelize } = require('sequelize');
const config = require('../../config');

const {
  port, host, username, password,
} = config.mysqlConfig;

const database = 'dice_game';

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: 'mysql',
  port,

});

// TODO Modificarlo para que cree la base de datos si no existe
const connectSequelize = async () => {
  try {
    await sequelize.sync({ force: false });// TODO cambiar a false cuand otermines los modelos!
    console.log('Connection to mySQL-DB has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

connectSequelize();

module.exports = sequelize;
