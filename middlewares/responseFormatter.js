const responseFormatter = (req, res, next) => {
  res.apiResponse = (success, message, data = null, statusCode = 200) => {
    res.status(statusCode).json({
      success,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  };
  
  res.success = (data, message = 'Success', statusCode = 200) => {
    res.apiResponse(true, message, data, statusCode);
  };
  
  res.error = (message = 'Error', statusCode = 500, data = null) => {
    res.apiResponse(false, message, data, statusCode);
  };
  
  next();
};

module.exports = responseFormatter;