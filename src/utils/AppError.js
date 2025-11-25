class AppError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational; // Trusted error (not a bug)

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
