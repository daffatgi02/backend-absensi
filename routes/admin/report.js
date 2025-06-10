const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/admin/reportController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Apply authentication and admin authorization
router.use(authenticate);
router.use(authorize(['admin']));

// Employee report
router.get('/employees', reportController.getEmployeeReport);

// Attendance report
router.get('/attendance',
  reportController.attendanceReportValidation,
  reportController.handleValidationErrors,
  reportController.getAttendanceReport
);

// Export attendance report to Excel
router.get('/attendance/export',
  reportController.attendanceReportValidation,
  reportController.handleValidationErrors,
  reportController.exportAttendanceReport
);

// Visit report
router.get('/visits', reportController.getVisitReport);

// Entry exit report
router.get('/entry-exit', reportController.getEntryExitReport);

module.exports = router;