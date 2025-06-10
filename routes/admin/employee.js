const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/admin/employeeController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize(['admin']));

// Get all employees
router.get('/', employeeController.getAll);

// Get employee by ID
router.get('/:id', employeeController.getById);

// Create new employee
router.post('/',
  employeeController.createValidation,
  employeeController.handleValidationErrors,
  employeeController.create
);

// Update employee
router.put('/:id',
  employeeController.updateValidation,
  employeeController.handleValidationErrors,
  employeeController.update
);

// Delete employee
router.delete('/:id', employeeController.delete);

module.exports = router;