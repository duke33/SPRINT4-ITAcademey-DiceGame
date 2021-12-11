require('dotenv').config();

const { PORT } = process.env;

const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
// TODO vas a tener que borrar esto!!???

const mysqlConfig = {
  port: process.env.MYSQL_PORT,
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
};

let dbByEnv;

if (process.env.NODE_ENV === 'mongo-persistence') {
  dbByEnv = './data-base/db-mongo';
} else if (process.env.NODE_ENV === 'mysql-persistence') {
  dbByEnv = './data-base/db-mySQL';
}

module.exports = {
  MONGODB_URI,
  PORT,
  mysqlConfig,
  dbByEnv,
};

// TODO fijate de subir .env
