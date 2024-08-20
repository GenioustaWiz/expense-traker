const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
  
    // Default error status and message
    let status = 500;
    let message = 'Internal Server Error';
  
    // Handle specific error types
    if (err.name === 'ValidationError') {
      status = 400;
      message = err.message;
    } else if (err.name === 'UnauthorizedError') {
      status = 401;
      message = 'Unauthorized';
    } else if (err.name === 'ForbiddenError') {
      status = 403;
      message = 'Forbidden';
    } else if (err.name === 'NotFoundError') {
      status = 404;
      message = 'Not Found';
    }
  
    // Send error response
    res.status(status).json({
      error: {
        message: message,
        status: status
      }
    });
  };
  
  module.exports = errorMiddleware;