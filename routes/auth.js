const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

// Login
router.post('/login', 
  authController.loginValidation,
  authController.handleValidationErrors,
  authController.login
);

// Refresh token
router.post('/refresh-token', 
  authenticate,
  authController.refreshToken
);

// Logout
router.post('/logout', 
  authenticate,
  authController.logout
);

// Get profile
router.get('/profile', 
  authenticate,
  authController.getProfile
);

module.exports = router;