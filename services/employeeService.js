const { Employee, Division, Position, WorkShift } = require('../models');
const { Op } = require('sequelize');

class EmployeeService {
  async getAllEmployees(filters = {}) {
    try {
      const where = { isActive: true };
      
      if (filters.divisionId) {
        where.divisionId = filters.divisionId;
      }
      
      if (filters.positionId) {
        where.positionId = filters.positionId;
      }
      
      if (filters.search) {
        where[Op.or] = [
          { fullName: { [Op.like]: `%${filters.search}%` } },
          { employeeId: { [Op.like]: `%${filters.search}%` } }
        ];
      }

      const employees = await Employee.findAll({
        where,
        include: [
          { model: Division, as: 'division' },
          { model: Position, as: 'position' },
          { model: WorkShift, as: 'workShift' }
        ],
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });

      return employees;
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeById(id) {
    try {
      const employee = await Employee.findByPk(id, {
        include: [
          { model: Division, as: 'division' },
          { model: Position, as: 'position' },
          { model: WorkShift, as: 'workShift' }
        ],
        attributes: { exclude: ['password'] }
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      return employee;
    } catch (error) {
      throw error;
    }
  }

  async createEmployee(data) {
    try {
      const employee = await Employee.create(data);
      return await this.getEmployeeById(employee.id);
    } catch (error) {
      throw error;
    }
  }

  async updateEmployee(id, data) {
    try {
      const employee = await Employee.findByPk(id);
      
      if (!employee) {
        throw new Error('Employee not found');
      }

      await employee.update(data);
      return await this.getEmployeeById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteEmployee(id) {
    try {
      const employee = await Employee.findByPk(id);
      
      if (!employee) {
        throw new Error('Employee not found');
      }

      await employee.update({ isActive: false });
      return { message: 'Employee deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(employeeId, data) {
    try {
      const employee = await Employee.findByPk(employeeId);
      
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Only allow certain fields to be updated in profile
      const allowedFields = ['fullName', 'phoneNumber'];
      const updateData = {};
      
      allowedFields.forEach(field => {
        if (data[field] !== undefined) {
          updateData[field] = data[field];
        }
      });

      if (data.password) {
        updateData.password = data.password;
      }

      await employee.update(updateData);
      return await this.getEmployeeById(employeeId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new EmployeeService();