const express = require('express');
const router = express.Router();
const positionController = require('../../controllers/admin/positionController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Apply authentication and admin authorization
router.use(authenticate);
router.use(authorize(['admin']));

// Get all positions
router.get('/', positionController.getAll);

// Get position by ID
router.get('/:id', positionController.getById);

// Create new position
router.post('/',
  positionController.validation,
  positionController.handleValidationErrors,
  positionController.create
);

// Update position
router.put('/:id',
  positionController.validation,
  positionController.handleValidationErrors,
  positionController.update
);

// Delete position
router.delete('/:id', positionController.delete);

module.exports = router;