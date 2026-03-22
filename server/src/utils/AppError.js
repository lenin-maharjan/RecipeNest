class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // calls the parent Error class with the message

    this.statusCode = statusCode;
    this.isOperational = true; // marks this as a known/expected error

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;