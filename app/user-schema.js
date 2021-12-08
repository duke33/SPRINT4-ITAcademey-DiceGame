const mongoose = require('mongoose');

const { Schema } = mongoose;

// TODO sacar esta funcion de aca
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

// assign a function to the "methods" object of our animalSchema
// TODO cambiar el nombre a esto por favor
UserSchema.methods.successRateCalc = successRateCalc;

// UserSchema.path('banana').get(() => `${JSON.stringify(this)} is my name`);

// TODO borrar esto si no lo usas UserSchema.set('toJSON', { getters: true });

// Compile model from schema
const User = mongoose.model('User', UserSchema);
module.exports = User;

// TODO ver la diferencia entre schema y model
