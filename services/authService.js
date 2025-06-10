const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

class AuthService {
  async login(employeeId, password) {
    try {
      const employee = await Employee.findOne({
        where: { employeeId, isActive: true },
        include: [
          { model: require('../models').Division, as: 'division' },
          { model: require('../models').Position, as: 'position' },
          { model: require('../models').WorkShift, as: 'workShift' }
        ]
      });

      if (!employee) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await employee.comparePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await employee.update({ lastLogin: new Date() });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: employee.id,
          employeeId: employee.employeeId,
          role: employee.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password from response
      const employeeData = employee.toJSON();
      delete employeeData.password;

      return {
        token,
        employee: employeeData
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(employeeId) {
    try {
      const employee = await Employee.findOne({
        where: { employeeId, isActive: true }
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      const token = jwt.sign(
        { 
          id: employee.id,
          employeeId: employee.employeeId,
          role: employee.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return { token };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();