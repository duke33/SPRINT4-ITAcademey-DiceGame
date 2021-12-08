const mongoose = require('mongoose');

const { Schema } = mongoose;

// Method to be used to calculate the succes rate for each instance
function successRateCalc() {
  const wonGames = this.gameLog.filter((obj) => obj.gameWon === true).length;
  const totalGames = this.gameLog.length;

  const successRate = ((wonGames / totalGames) * 100);
  if (!successRate) { return 0; }// TODO fijate como manejar esto mejor
  this.successRate = successRate;
  return successRate;
}

const UserSchema = new Schema({
  name: { type: String, default: 'anonymous' },
  gameLog: [],
  successRate: { type: Number, default: 0 },

});

// assign a function to the "methods" object of UserSchema
UserSchema.methods.successRateCalc = successRateCalc;

// Compile model from schema
const User = mongoose.model('User', UserSchema);
module.exports = User;
