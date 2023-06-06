class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    // use captureStackTrace - only show the stack before this constructor when running server
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
