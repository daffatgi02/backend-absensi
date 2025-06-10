const express = require('express');
const router = express.Router();
const entryExitController = require('../../controllers/user/entryExitController');
const { authenticate } = require('../../middlewares/auth');
const fs = require('fs');
const path = require('path');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/entry-exit');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Apply authentication to all routes
router.use(authenticate);

// Get all entry exit requests
router.get('/', entryExitController.getAll);

// Get entry exit request by ID
router.get('/:id', entryExitController.getById);

// Create new entry exit request
router.post('/',
  entryExitController.upload.single('attachment'),
  entryExitController.createValidation,
  entryExitController.handleValidationErrors,
  entryExitController.create
);

// Update entry exit request
router.put('/:id',
  entryExitController.upload.single('attachment'),
  entryExitController.updateValidation,
  entryExitController.handleValidationErrors,
  entryExitController.update
);

// Delete entry exit request
router.delete('/:id', entryExitController.delete);

module.exports = router;