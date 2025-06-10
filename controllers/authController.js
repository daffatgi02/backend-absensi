const { body } = require('express-validator');
const authService = require('../services/authService');
const { handleValidationErrors } = require('../middlewares/validation');

class AuthController {
  // Validation rules
  static loginValidation = [
    body('employeeId')
      .notEmpty()
      .withMessage('Employee ID is required')
      .isLength({ min: 3, max: 20 })
      .withMessage('Employee ID must be between 3-20 characters'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ];

  async login(req, res, next) {
    try {
      const { employeeId, password } = req.body;
      
      const result = await authService.login(employeeId, password);
      
      res.success(result, 'Login successful');
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.error('Invalid employee ID or password', 401);
      }
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { employeeId } = req.user;
      
      const result = await authService.refreshToken(employeeId);
      
      res.success(result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res) {
    // Since we're using stateless JWT, we just send success response
    // In production, you might want to implement token blacklisting
    res.success(null, 'Logout successful');
  }

  async getProfile(req, res) {
    const userData = req.user.toJSON();
    delete userData.password;
    res.success(userData, 'Profile retrieved successfully');
  }
}

// Export instance with validation
const authController = new AuthController();
authController.loginValidation = AuthController.loginValidation;
authController.handleValidationErrors = handleValidationErrors;

module.exports = authController;