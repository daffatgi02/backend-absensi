const express = require('express');
const router = express.Router();
const divisionController = require('../../controllers/admin/divisionController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Apply authentication and admin authorization
router.use(authenticate);
router.use(authorize(['admin']));

// Get all divisions
router.get('/', divisionController.getAll);

// Get division by ID
router.get('/:id', divisionController.getById);

// Create new division
router.post('/',
  divisionController.validation,
  divisionController.handleValidationErrors,
  divisionController.create
);

// Update division
router.put('/:id',
  divisionController.validation,
  divisionController.handleValidationErrors,
  divisionController.update
);

// Delete division
router.delete('/:id', divisionController.delete);

module.exports = router;