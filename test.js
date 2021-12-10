const mysql = require('mysql2');

const mysqlCon = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password,
});

mysqlCon.connect((err) => {
  // Check Database
  mysqlCon.query(
    `SHOW DATABASES LIKE ${config.database}`,
    (err, result) => {
      if (err) {
        // Create new Database
        mysqlCon.query(
          `CREATE DATABASE ${config.database}`,
          (err, result) => {
            if (!err) {
              // Sync sequelize js model files
              models.sequelize.sync().then(() => {
                console.log('Database connected successfully!');
              }).catch((err) => {
                console.log(err, 'Something went wrong with the Database!');
              });
            }
          },
        );
      }
    },
  );
  if (err) {
    console.log(err.message);
  } else {
    console.log('Connected!');
  }
});
