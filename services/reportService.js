const { Employee, Attendance, Division, Position, EmployeeVisit, EntryExitRequest } = require('../models');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const Helpers = require('../utils/helpers');

class ReportService {
  async getEmployeeReport(filters = {}) {
    try {
      const {
        divisionId,
        positionId,
        search,
        isActive = true,
        page = 1,
        limit = 50
      } = filters;

      const whereClause = {};
      
      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }
      
      if (divisionId) {
        whereClause.divisionId = divisionId;
      }
      
      if (positionId) {
        whereClause.positionId = positionId;
      }
      
      if (search) {
        whereClause[Op.or] = [
          { fullName: { [Op.like]: `%${search}%` } },
          { employeeId: { [Op.like]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;

      const employees = await Employee.findAndCountAll({
        where: whereClause,
        include: [
          { model: Division, as: 'division', attributes: ['name'] },
          { model: Position, as: 'position', attributes: ['name'] }
        ],
        attributes: { exclude: ['password'] },
        order: [['fullName', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        employees: employees.rows,
        pagination: Helpers.calculatePagination(page, limit, employees.count)
      };
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceReport(filters = {}) {
    try {
      const {
        startDate,
        endDate,
        divisionId,
        employeeId,
        status,
        page = 1,
        limit = 50
      } = filters;

      const whereClause = {};
      const employeeWhere = {};
      
      if (startDate && endDate) {
        whereClause.date = {
          [Op.between]: [startDate, endDate]
        };
      }
      
      if (employeeId) {
        whereClause.employeeId = employeeId;
      }
      
      if (status) {
        whereClause.status = status;
      }
      
      if (divisionId) {
        employeeWhere.divisionId = divisionId;
      }

      const offset = (page - 1) * limit;

      const attendances = await Attendance.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Employee,
            as: 'employee',
            where: employeeWhere,
            attributes: ['employeeId', 'fullName'],
            include: [
              { model: Division, as: 'division', attributes: ['name'] },
              { model: Position, as: 'position', attributes: ['name'] }
            ]
          }
        ],
        order: [['date', 'DESC'], ['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        attendances: attendances.rows,
        pagination: Helpers.calculatePagination(page, limit, attendances.count)
      };
    } catch (error) {
      throw error;
    }
  }

  async exportAttendanceToExcel(filters = {}) {
    try {
      // Get all attendance data without pagination for export
      const attendanceData = await this.getAttendanceReport({
        ...filters,
        page: 1,
        limit: 10000 // Large number to get all data
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Laporan Absensi');

      // Set column headers
      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'ID Karyawan', key: 'employeeId', width: 15 },
        { header: 'Nama Lengkap', key: 'fullName', width: 25 },
        { header: 'Divisi', key: 'division', width: 20 },
        { header: 'Jabatan', key: 'position', width: 20 },
        { header: 'Tanggal', key: 'date', width: 12 },
        { header: 'Jam Masuk', key: 'checkIn', width: 12 },
        { header: 'Jam Keluar', key: 'checkOut', width: 12 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Catatan', key: 'notes', width: 30 }
      ];

      // Style the header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Add data rows
      attendanceData.attendances.forEach((attendance, index) => {
        worksheet.addRow({
          no: index + 1,
          employeeId: attendance.employee.employeeId,
          fullName: attendance.employee.fullName,
          division: attendance.employee.division?.name || '-',
          position: attendance.employee.position?.name || '-',
          date: Helpers.formatDate(attendance.date),
          checkIn: Helpers.formatTime(attendance.checkIn),
          checkOut: Helpers.formatTime(attendance.checkOut),
          status: attendance.status,
          notes: attendance.notes || '-'
        });
      });

      // Generate Excel buffer
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (error) {
      throw error;
    }
  }

  async getVisitReport(filters = {}) {
    try {
      const {
        startDate,
        endDate,
        divisionId,
        employeeId,
        status,
        page = 1,
        limit = 50
      } = filters;

      const whereClause = {};
      const employeeWhere = {};
      
      if (startDate && endDate) {
        whereClause.visitDate = {
          [Op.between]: [startDate, endDate]
        };
      }
      
      if (employeeId) {
        whereClause.employeeId = employeeId;
      }
      
      if (status) {
        whereClause.status = status;
      }
      
      if (divisionId) {
        employeeWhere.divisionId = divisionId;
      }

      const offset = (page - 1) * limit;

      const visits = await EmployeeVisit.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Employee,
            as: 'employee',
            where: employeeWhere,
            attributes: ['employeeId', 'fullName'],
            include: [
              { model: Division, as: 'division', attributes: ['name'] }
            ]
          },
          {
            model: Employee,
            as: 'approver',
            attributes: ['fullName'],
            required: false
          }
        ],
        order: [['visitDate', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        visits: visits.rows,
        pagination: Helpers.calculatePagination(page, limit, visits.count)
      };
    } catch (error) {
      throw error;
    }
  }

  async getEntryExitReport(filters = {}) {
    try {
      const {
        startDate,
        endDate,
        divisionId,
        employeeId,
        type,
        status,
        page = 1,
        limit = 50
      } = filters;

      const whereClause = {};
      const employeeWhere = {};
      
      if (startDate && endDate) {
        whereClause.requestDate = {
          [Op.between]: [startDate, endDate]
        };
      }
      
      if (employeeId) {
        whereClause.employeeId = employeeId;
      }
      
      if (type) {
        whereClause.type = type;
      }
      
      if (status) {
        whereClause.status = status;
      }
      
      if (divisionId) {
        employeeWhere.divisionId = divisionId;
      }

      const offset = (page - 1) * limit;

      const requests = await EntryExitRequest.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Employee,
            as: 'employee',
            where: employeeWhere,
            attributes: ['employeeId', 'fullName'],
            include: [
              { model: Division, as: 'division', attributes: ['name'] }
            ]
          },
          {
            model: Employee,
            as: 'approver',
            attributes: ['fullName'],
            required: false
          }
        ],
        order: [['requestDate', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        requests: requests.rows,
        pagination: Helpers.calculatePagination(page, limit, requests.count)
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ReportService();