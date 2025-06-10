const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/user/profileController');
const { authenticate } = require('../../middlewares/auth');

// Apply authentication to all routes
router.use(authenticate);

// Get profile
router.get('/', profileController.getProfile);

// Update profile
router.put('/',
  profileController.updateValidation,
  profileController.handleValidationErrors,
  profileController.updateProfile
);

module.exports = router;