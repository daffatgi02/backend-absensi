const { body } = require('express-validator');
const { Attendance } = require('../../models');
const { handleValidationErrors } = require('../../middlewares/validation');

class AttendanceController {
  static checkInValidation = [
    body('notes').optional().isLength({ max: 255 }).withMessage('Notes too long')
  ];

  async checkIn(req, res, next) {
    try {
      const employeeId = req.user.id;
      const today = new Date().toISOString().split('T')[0];
      
      // Check if already checked in today
      const existingAttendance = await Attendance.findOne({
        where: { employeeId, date: today }
      });

      if (existingAttendance && existingAttendance.checkIn) {
        return res.error('Already checked in today', 400);
      }

      const currentTime = new Date().toTimeString().split(' ')[0];
      
      let attendance;
      if (existingAttendance) {
        attendance = await existingAttendance.update({
          checkIn: currentTime,
          status: 'present',
          notes: req.body.notes
        });
      } else {
        attendance = await Attendance.create({
          employeeId,
          date: today,
          checkIn: currentTime,
          status: 'present',
          notes: req.body.notes
        });
      }

      res.success(attendance, 'Check in successful');
    } catch (error) {
      next(error);
    }
  }

  async checkOut(req, res, next) {
    try {
      const employeeId = req.user.id;
      const today = new Date().toISOString().split('T')[0];
      
      const attendance = await Attendance.findOne({
        where: { employeeId, date: today }
      });

      if (!attendance) {
        return res.error('No check in record found for today', 400);
      }

      if (attendance.checkOut) {
        return res.error('Already checked out today', 400);
      }

      const currentTime = new Date().toTimeString().split(' ')[0];
      
      await attendance.update({
        checkOut: currentTime,
        notes: req.body.notes || attendance.notes
      });

      res.success(attendance, 'Check out successful');
    } catch (error) {
      next(error);
    }
  }

  async getTodayAttendance(req, res, next) {
    try {
      const employeeId = req.user.id;
      const today = new Date().toISOString().split('T')[0];
      
      const attendance = await Attendance.findOne({
        where: { employeeId, date: today }
      });

      res.success(attendance, 'Today attendance retrieved');
    } catch (error) {
      next(error);
    }
  }
}

const attendanceController = new AttendanceController();
attendanceController.checkInValidation = AttendanceController.checkInValidation;
attendanceController.handleValidationErrors = handleValidationErrors;

module.exports = attendanceController;