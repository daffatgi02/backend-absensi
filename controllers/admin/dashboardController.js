const { Employee, Attendance, Announcement, Division } = require('../../models');
const { Op } = require('sequelize');

class DashboardController {
  async getStats(req, res, next) {
    try {
      // Total employees
      const totalEmployees = await Employee.count({
        where: { isActive: true }
      });

      // Today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = await Attendance.findAll({
        where: { date: today },
        include: [
          {
            model: Employee,
            as: 'employee',
            attributes: ['id', 'fullName', 'employeeId'],
            include: [
              { model: Division, as: 'division', attributes: ['name'] }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      // Active announcements
      const announcements = await Announcement.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gte]: new Date() } }
          ]
        },
        include: [
          {
            model: Employee,
            as: 'creator',
            attributes: ['fullName']
          }
        ],
        order: [['priority', 'DESC'], ['createdAt', 'DESC']],
        limit: 5
      });

      const stats = {
        totalEmployees,
        todayAttendanceCount: todayAttendance.length,
        recentAttendances: todayAttendance,
        announcements
      };

      res.success(stats, 'Dashboard stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceStats(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      
      const whereClause = {};
      if (startDate && endDate) {
        whereClause.date = {
          [Op.between]: [startDate, endDate]
        };
      }

      const attendanceStats = await Attendance.findAll({
        where: whereClause,
        attributes: [
          'status',
          [require('sequelize').fn('COUNT', require('sequelize').col('status')), 'count']
        ],
        group: ['status']
      });

      res.success(attendanceStats, 'Attendance statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();