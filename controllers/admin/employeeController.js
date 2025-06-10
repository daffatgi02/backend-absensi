const { body, param, query } = require('express-validator');
const employeeService = require('../../services/employeeService');
const { handleValidationErrors } = require('../../middlewares/validation');

class EmployeeController {
  // Validation rules
  static createValidation = [
    body('employeeId')
      .notEmpty()
      .withMessage('Employee ID is required')
      .isLength({ min: 3, max: 20 })
      .withMessage('Employee ID must be between 3-20 characters'),
    body('fullName')
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be between 2-100 characters'),
    body('phoneNumber')
      .notEmpty()
      .withMessage('Phone number is required')
      .isMobilePhone('id-ID')
      .withMessage('Invalid phone number format'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('divisionId')
      .notEmpty()
      .withMessage('Division is required')
      .isInt()
      .withMessage('Division ID must be a number'),
    body('positionId')
      .notEmpty()
      .withMessage('Position is required')
      .isInt()
      .withMessage('Position ID must be a number'),
    body('workShiftId')
      .optional()
      .isInt()
      .withMessage('Work Shift ID must be a number'),
    body('role')
      .optional()
      .isIn(['admin', 'employee'])
      .withMessage('Role must be admin or employee')
  ];

  static updateValidation = [
    param('id').isInt().withMessage('Invalid employee ID'),
    body('fullName')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be between 2-100 characters'),
    body('phoneNumber')
      .optional()
      .isMobilePhone('id-ID')
      .withMessage('Invalid phone number format'),
    body('divisionId')
      .optional()
      .isInt()
      .withMessage('Division ID must be a number'),
    body('positionId')
      .optional()
      .isInt()
      .withMessage('Position ID must be a number'),
    body('workShiftId')
      .optional()
      .isInt()
      .withMessage('Work Shift ID must be a number'),
    body('role')
      .optional()
      .isIn(['admin', 'employee'])
      .withMessage('Role must be admin or employee')
  ];

  async getAll(req, res, next) {
    try {
      const filters = {
        divisionId: req.query.divisionId,
        positionId: req.query.positionId,
        search: req.query.search
      };

      const employees = await employeeService.getAllEmployees(filters);
      
      res.success(employees, 'Employees retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      
      const employee = await employeeService.getEmployeeById(id);
      
      res.success(employee, 'Employee retrieved successfully');
    } catch (error) {
      if (error.message === 'Employee not found') {
        return res.error('Employee not found', 404);
      }
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const employee = await employeeService.createEmployee(req.body);
      
      res.success(employee, 'Employee created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      
      const employee = await employeeService.updateEmployee(id, req.body);
      
      res.success(employee, 'Employee updated successfully');
    } catch (error) {
      if (error.message === 'Employee not found') {
        return res.error('Employee not found', 404);
      }
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      await employeeService.deleteEmployee(id);
      
      res.success(null, 'Employee deleted successfully');
    } catch (error) {
      if (error.message === 'Employee not found') {
        return res.error('Employee not found', 404);
      }
      next(error);
    }
  }
}

// Export instance with validation
const employeeController = new EmployeeController();
employeeController.createValidation = EmployeeController.createValidation;
employeeController.updateValidation = EmployeeController.updateValidation;
employeeController.handleValidationErrors = handleValidationErrors;

module.exports = employeeController;