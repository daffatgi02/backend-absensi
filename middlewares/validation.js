const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.error('Validation failed', 400, errors.array());
  }
  next();
};

module.exports = { handleValidationErrors };