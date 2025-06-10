const { body } = require('express-validator');
const employeeService = require('../../services/employeeService');
const { handleValidationErrors } = require('../../middlewares/validation');

class ProfileController {
  static updateValidation = [
    body('fullName')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be between 2-100 characters'),
    body('phoneNumber')
      .optional()
      .isMobilePhone('id-ID')
      .withMessage('Invalid phone number format'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('currentPassword')
      .if(body('password').exists())
      .notEmpty()
      .withMessage('Current password is required when changing password')
  ];

  async getProfile(req, res, next) {
    try {
      const employee = await employeeService.getEmployeeById(req.user.id);
      
      res.success(employee, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      // If password is being changed, verify current password
      if (req.body.password && req.body.currentPassword) {
        const isValidPassword = await req.user.comparePassword(req.body.currentPassword);
        if (!isValidPassword) {
          return res.error('Current password is incorrect', 400);
        }
      }

      const employee = await employeeService.updateProfile(req.user.id, req.body);
      
      res.success(employee, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

const profileController = new ProfileController();
profileController.updateValidation = ProfileController.updateValidation;
profileController.handleValidationErrors = handleValidationErrors;

module.exports = profileController;