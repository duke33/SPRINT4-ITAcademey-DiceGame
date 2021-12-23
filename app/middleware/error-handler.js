const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
  } if (error.name === 'JsonWebTokenError') {
    response.status(401).json({
      error: 'token missing or invalid',
    });
  } if (error.name === 'TokenExpiredError') {
    response.status(401).json({
      error: 'token expired',
    });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
module.exports = { errorHandler, unknownEndpoint };
