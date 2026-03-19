/**
 * @file errorMiddleware.js
 * @description Centralized error handling middleware for the Express application.
 */

/**
 * Middleware to handle 404 Not Found errors.
 * triggered when no route matches the request.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler middleware.
 * Catches all errors passed via next(error) and sends a JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // If no specific status code was set, default to 500 (Internal Server Error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  } 
  // Handle Mongoose Duplicate Key Error
  else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  } 
  // Handle Mongoose Cast Error
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found with id of ${err.value}`;
  }
  // Handle Multer upload errors
  else if (err.message && (err.message.includes("Unsupported") || err.message.includes("File too large"))) {
    statusCode = 400;
  }

  // Always log the full error for diagnosis
  console.error(`❌ [${req.method}] ${req.originalUrl} → ${statusCode}: ${err.message}`);
  if (statusCode === 500) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message: message,
    // Include stack trace only in development environment for security
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

export { notFound, errorHandler };
