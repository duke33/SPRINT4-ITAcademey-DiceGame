require('dotenv').config();

const { PORT } = process.env;
const { MONGODB_URI } = process.env;

module.exports = {
  MONGODB_URI,
  PORT,
};
// TODO aplicar la uri de mongo
// TODO fijate de subir .env
