const { Model, DataTypes } = require('sequelize');
const sequelize = require('../data-base/db-mySQL');

class User extends Model {}
User.init({
  name: {
    type: DataTypes.STRING,
    defaultValue: 'anonymous',
  },
  registration_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { sequelize, modelName: 'user' });

module.exports = User;
