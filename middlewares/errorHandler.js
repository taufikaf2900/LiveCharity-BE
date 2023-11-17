const errorHandler = (err, req, res, next) => {
  console.log(err.name);

  let statusCode = err.status || 500;

  let messageError = err.error || 'Internal Server Error';

  if (err.name === 'SequelizeUniqueConstraintError' || 'SequelizeValidationError') {
    statusCode = 400;
    messageError = err.errors[0].message;
  }

  res.status(statusCode).json({ message: messageError });
};

module.exports = errorHandler;
