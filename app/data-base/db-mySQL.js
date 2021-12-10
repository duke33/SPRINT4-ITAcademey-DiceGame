const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dice-game', 'root', 'Pendragon9*', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  define: {
    paranoid: true,
  },
});

const connectSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

connectSequelize();
