const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();

loginRouter.post('/login', async (req, res) => { // TODO modificar todo esto
  const userProvided = req.body.user;

  const passwordProvided = req.body.password;
  const user = 'admin';
  const password = '12345';

  // En este lugar, deberia comprobar con la base de datos:
  const passwordCorrect = (userProvided === null || userProvided !== 'admin')
    ? false
    : (password === passwordProvided); // TODO tener cuidado aca con la triple igualdad

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }
  // TODO mover de lugar este archivo
  // TODO comprobar login con otros username y otros passwords

  const userForToken = user;
  // TODO buscar lo que seria un secret apropiado
  const token = jwt.sign(userForToken, process.env.SECRET);

  res
    .status(200)
    .send({ token, user });// TODO hacer este mensaje mas amigable
});

module.exports = loginRouter;
