const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));
    return res.error('Validation Error', 400, errors);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.error('Data already exists', 409);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.error('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return res.error('Token expired', 401);
  }

  // Custom errors
  if (err.statusCode) {
    return res.error(err.message, err.statusCode);
  }

  // Default error
  res.error('Internal Server Error', 500);
};

module.exports = errorHandler;