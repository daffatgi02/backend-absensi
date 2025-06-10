const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/user/dashboardController');
const { authenticate } = require('../../middlewares/auth');

// Apply authentication to all routes
router.use(authenticate);

// Get dashboard data
router.get('/', dashboardController.getDashboard);

// Get attendance history
router.get('/attendance-history', dashboardController.getAttendanceHistory);

module.exports = router;