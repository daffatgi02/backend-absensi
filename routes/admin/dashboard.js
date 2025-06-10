const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboardController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Apply authentication and admin authorization
router.use(authenticate);
router.use(authorize(['admin']));

// Get dashboard stats
router.get('/stats', dashboardController.getStats);

// Get attendance statistics
router.get('/attendance-stats', dashboardController.getAttendanceStats);

module.exports = router;