const express = require('express');
const router = express.Router();
const workShiftController = require('../../controllers/admin/workShiftController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Apply authentication and admin authorization
router.use(authenticate);
router.use(authorize(['admin']));

// Get all work shifts
router.get('/', workShiftController.getAll);

// Get work shift by ID
router.get('/:id', workShiftController.getById);

// Create new work shift
router.post('/',
  workShiftController.validation,
  workShiftController.handleValidationErrors,
  workShiftController.create
);

// Update work shift
router.put('/:id',
  workShiftController.validation,
  workShiftController.handleValidationErrors,
  workShiftController.update
);

// Delete work shift
router.delete('/:id', workShiftController.delete);

module.exports = router;