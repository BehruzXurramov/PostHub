const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Handle known operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    return res.status(400).json({
      status: "fail",
      message: "Invalid input data",
      errors,
    });
  }

  // Handle Duplicate Key Error (MongoDB 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return res.status(409).json({
      status: "fail",
      message: `This ${field}: '${value}' is already taken. Please use another one.`,
    });
  }

  // Handle JWT/Token errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token. Please log in again.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "fail",
      message: "Your token has expired. Please log in again.",
    });
  }

  // For unexpected errors (programming bugs) - don't leak details in production
  if (process.env.NODE_ENV === "production") {
    console.error("ERROR 💥", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }

  // Development: show full error
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

export default errorHandler;
