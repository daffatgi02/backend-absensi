const express = require('express');
const router = express.Router();
const attendanceController = require('../../controllers/user/attendanceController');
const { authenticate } = require('../../middlewares/auth');

router.use(authenticate);

// Get today's attendance
router.get('/today', attendanceController.getTodayAttendance);

// Check in
router.post('/check-in',
  attendanceController.checkInValidation,
  attendanceController.handleValidationErrors,
  attendanceController.checkIn
);

// Check out
router.post('/check-out',
  attendanceController.checkInValidation,
  attendanceController.handleValidationErrors,
  attendanceController.checkOut
);

module.exports = router;