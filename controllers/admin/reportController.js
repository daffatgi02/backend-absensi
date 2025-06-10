const { query } = require('express-validator');
const reportService = require('../../services/reportService');
const { handleValidationErrors } = require('../../middlewares/validation');

class ReportController {
  static attendanceReportValidation = [
    query('startDate')
      .optional()
      .isDate()
      .withMessage('Start date must be a valid date'),
    query('endDate')
      .optional()
      .isDate()
      .withMessage('End date must be a valid date'),
    query('divisionId')
      .optional()
      .isInt()
      .withMessage('Division ID must be a number'),
    query('employeeId')
      .optional()
      .isInt()
      .withMessage('Employee ID must be a number')
  ];

  async getEmployeeReport(req, res, next) {
    try {
      const filters = {
        divisionId: req.query.divisionId,
        positionId: req.query.positionId,
        search: req.query.search,
        isActive: req.query.isActive,
        page: req.query.page,
        limit: req.query.limit
      };

      const report = await reportService.getEmployeeReport(filters);
      
      res.success(report, 'Employee report retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceReport(req, res, next) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        divisionId: req.query.divisionId,
        employeeId: req.query.employeeId,
        status: req.query.status,
        page: req.query.page,
        limit: req.query.limit
      };

      const report = await reportService.getAttendanceReport(filters);
      
      res.success(report, 'Attendance report retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async exportAttendanceReport(req, res, next) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        divisionId: req.query.divisionId,
        employeeId: req.query.employeeId,
        status: req.query.status
      };

      const excelBuffer = await reportService.exportAttendanceToExcel(filters);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.xlsx');
      
      res.send(excelBuffer);
    } catch (error) {
      next(error);
    }
  }

  async getVisitReport(req, res, next) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        divisionId: req.query.divisionId,
        employeeId: req.query.employeeId,
        status: req.query.status,
        page: req.query.page,
        limit: req.query.limit
      };

      const report = await reportService.getVisitReport(filters);
      
      res.success(report, 'Visit report retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getEntryExitReport(req, res, next) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        divisionId: req.query.divisionId,
        employeeId: req.query.employeeId,
        type: req.query.type,
        status: req.query.status,
        page: req.query.page,
        limit: req.query.limit
      };

      const report = await reportService.getEntryExitReport(filters);
      
      res.success(report, 'Entry exit report retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

const reportController = new ReportController();
reportController.attendanceReportValidation = ReportController.attendanceReportValidation;
reportController.handleValidationErrors = handleValidationErrors;

module.exports = reportController;