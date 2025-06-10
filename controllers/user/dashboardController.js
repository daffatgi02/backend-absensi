const { Attendance, Announcement, EmployeeVisit, EntryExitRequest } = require('../../models');
const { Op } = require('sequelize');

class UserDashboardController {
  async getDashboard(req, res, next) {
    try {
      const employeeId = req.user.id;
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      // Welcome messages
      const welcomeMessages = [
        "Semangat kerja hari ini! 💪",
        "Hari yang produktif dimulai dari sekarang! 🌟",
        "Kebesaran dimulai dari hal-hal kecil! ✨",
        "Jadilah yang terbaik hari ini! 🚀"
      ];
      
      const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

      // Recent attendances
      const recentAttendances = await Attendance.findAll({
        where: { 
          employeeId,
          date: {
            [Op.gte]: new Date(currentYear, currentMonth - 1, 1),
            [Op.lte]: new Date(currentYear, currentMonth, 0)
          }
        },
        order: [['date', 'DESC']],
        limit: 10
      });

      // Attendance statistics for current month
      const attendanceStats = await Attendance.findAll({
        where: { 
          employeeId,
          date: {
            [Op.gte]: new Date(currentYear, currentMonth - 1, 1),
            [Op.lte]: new Date(currentYear, currentMonth, 0)
          }
        },
        attributes: [
          'status',
          [require('sequelize').fn('COUNT', require('sequelize').col('status')), 'count']
        ],
        group: ['status']
      });

      // Announcements for user
      const announcements = await Announcement.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { targetType: 'all' },
            { 
              targetType: 'division',
              targetId: req.user.divisionId
            },
            {
              targetType: 'individual',
              targetId: employeeId
            }
          ],
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gte]: new Date() } }
          ]
        },
        order: [['priority', 'DESC'], ['createdAt', 'DESC']],
        limit: 5
      });

      // Pending requests count
      const pendingVisits = await EmployeeVisit.count({
        where: { employeeId, status: 'pending' }
      });

      const pendingEntryExit = await EntryExitRequest.count({
        where: { employeeId, status: 'pending' }
      });

      const dashboard = {
        welcomeMessage: randomWelcome,
        attendanceStats,
        recentAttendances,
        announcements,
        pendingRequests: {
          visits: pendingVisits,
          entryExit: pendingEntryExit
        }
      };

      res.success(dashboard, 'Dashboard data retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceHistory(req, res, next) {
    try {
      const { startDate, endDate, page = 1, limit = 20 } = req.query;
      const employeeId = req.user.id;
      const offset = (page - 1) * limit;

      const whereClause = { employeeId };
      
      if (startDate && endDate) {
        whereClause.date = {
          [Op.between]: [startDate, endDate]
        };
      }

      const attendances = await Attendance.findAndCountAll({
        where: whereClause,
        order: [['date', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.success({
        attendances: attendances.rows,
        pagination: {
          total: attendances.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(attendances.count / limit)
        }
      }, 'Attendance history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserDashboardController();