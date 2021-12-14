const jwt = require('jsonwebtoken');
const authenticationRouter = require('express').Router();

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};
// TODO call next!!!!!!
// TODO borrar los logs
authenticationRouter.all('*', async (req, res, next) => {
  console.log('Entra al authenticationRouter');
  const token = getTokenFrom(req);
  console.log('token:::', token);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.user) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  console.log(`Authenticated as ${decodedToken.user}`)(next());
});

module.exports = authenticationRouter;
// TODO verificar que mierda esta pasando con el usuario aca, parece que no estas controlando nada

//    "token": "eyJhbGciOiJIUzI1NiJ9.YWRtaW4.va0_hFdSaYPdMwhAGumoXQ7RMvIx6hq60kPWCSUOTkI",
//    "token": "eyJhbGciOiJIUzI1NiJ9.YWRtaW4.va0_hFdSaYPdMwhAGumoXQ7RMvIx6hq60kPWCSUOTkI",
