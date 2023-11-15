const errorHandler = (err, req, res, next) => {
  console.log(err);
  let statusCode = err.status || 500;
  let message = statusCode === 500 ? 'Internal Server Error' : err.message;

  switch(err.name) {
    case 'SequelizeValidationError':
    case 'SequelizeUniqueConstraintError':
      statusCode = 400;
      message = err.errors[0].message;
      break;
    case 'JsonWebTokenError':
      statusCode = 401;
      message = 'Unauthorized';
      break;
    case 'MidtransError':
      statusCode = err.httpStatusCode;
      message = err.ApiResponse.error_messages[0]
      break;
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;