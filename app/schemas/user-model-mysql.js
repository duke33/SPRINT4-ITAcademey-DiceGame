const { Model, DataTypes } = require('sequelize');
const sequelize = require('../data-base/db-mySQL');

class User extends Model {}
User.init({
  username: DataTypes.STRING,
  birthday: DataTypes.DATE,
}, { sequelize, modelName: 'user' });

module.exports = User;

// TODO borrar esto
// (async () => {
//   await sequelize.sync();
//   const jane = await User.create({
//     username: 'janedoe',
//     birthday: new Date(1980, 6, 20),
//   });
//   console.log(jane.toJSON());
// })();
