const errorHandler = (err, req, res, next) => {
  // console.log(err);

  let statusCode = err.status || 500;

  let messageError = err.error || 'Internal Server Error';

  if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
    statusCode = 400;
    messageError = err.errors[0].message;
  } else if(err.name === 'JsonWebTokenError') {
    statusCode = 401,
    messageError = 'unauthenticated';
  }

  res.status(statusCode).json({ message: messageError });
};

module.exports = errorHandler;
