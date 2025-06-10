const express = require('express');
const router = express.Router();
const announcementController = require('../../controllers/admin/announcementController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Apply authentication and admin authorization
router.use(authenticate);
router.use(authorize(['admin']));

// Get all announcements
router.get('/', announcementController.getAll);

// Get announcement by ID
router.get('/:id', announcementController.getById);

// Create new announcement
router.post('/',
  announcementController.createValidation,
  announcementController.handleValidationErrors,
  announcementController.create
);

// Update announcement
router.put('/:id',
  announcementController.updateValidation,
  announcementController.handleValidationErrors,
  announcementController.update
);

// Delete announcement
router.delete('/:id', announcementController.delete);

// Publish announcement
router.patch('/:id/publish', announcementController.publish);

module.exports = router;