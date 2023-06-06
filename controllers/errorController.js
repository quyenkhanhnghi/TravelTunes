const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} with value ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateErrorDB = (err) => {
  const valueDup = err.errmsg.match(/"(.*?)"/)[1];
  const message = `Duplicate filed value : ${valueDup}. Please try another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((err) => err.message);
  const message = `Invalid input. ${errors.join(', ')}`;
  return new AppError(message, 400);
};
const handleJsonWebTokenErrorDB = (err) =>
  new AppError('Invalid token. Please login again', 401);
const handleTokenExpiredErrorDB = (err) =>
  new AppError('Token expired. Please log in again', 401);
const ErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    err: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};
const ErrorPro = (err, res) => {
  // operational, trusted errors -> send back to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming/ others errors -> not send back to client
  } else {
    // cgl err
    console.log('Error here', err);
    // Send general error message
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong - not from OperationError',
    });
  }
};

const erorrHandler = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    ErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // copy the prototype of the error object
    let error = Object.assign(err);
    // not
    // let error = { ...err };
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenErrorDB(error);
    }
    if (error.name === 'TokenExpiredError') {
      error = handleTokenExpiredErrorDB(error);
    }
    ErrorPro(error, res);
  }
};

module.exports = erorrHandler;
