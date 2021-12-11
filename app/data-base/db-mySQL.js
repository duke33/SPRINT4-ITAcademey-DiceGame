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
  define: {
    paranoid: true,
  },
});

// TODO Modificarlo para que cree la base de datos si no existe
const connectSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to mySQL-DB has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

connectSequelize();
