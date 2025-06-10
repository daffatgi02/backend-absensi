const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.error('Access denied. No token provided.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findByPk(decoded.id, {
      include: ['division', 'position']
    });

    if (!employee) {
      return res.error('Invalid token', 401);
    }

    req.user = employee;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.error('Access denied. Insufficient permissions.', 403);
    }
    next();
  };
};

module.exports = { authenticate, authorize };