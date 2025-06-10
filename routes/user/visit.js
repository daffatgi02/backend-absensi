const express = require('express');
const router = express.Router();
const visitController = require('../../controllers/user/visitController');
const { authenticate } = require('../../middlewares/auth');
const fs = require('fs');
const path = require('path');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/visits');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Apply authentication to all routes
router.use(authenticate);

// Get all visits
router.get('/', visitController.getAll);

// Get visit by ID
router.get('/:id', visitController.getById);

// Create new visit
router.post('/',
  visitController.upload.single('attachment'),
  visitController.createValidation,
  visitController.handleValidationErrors,
  visitController.create
);

// Update visit
router.put('/:id',
  visitController.upload.single('attachment'),
  visitController.updateValidation,
  visitController.handleValidationErrors,
  visitController.update
);

// Delete visit
router.delete('/:id', visitController.delete);

module.exports = router;