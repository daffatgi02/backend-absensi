'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Division, {
        foreignKey: 'divisionId',
        as: 'division'
      });
      
      Employee.belongsTo(models.Position, {
        foreignKey: 'positionId',
        as: 'position'
      });
      
      Employee.belongsTo(models.WorkShift, {
        foreignKey: 'workShiftId',
        as: 'workShift'
      });
      
      Employee.hasMany(models.Attendance, {
        foreignKey: 'employeeId',
        as: 'attendances'
      });
      
      Employee.hasMany(models.EmployeeVisit, {
        foreignKey: 'employeeId',
        as: 'visits'
      });
      
      Employee.hasMany(models.EntryExitRequest, {
        foreignKey: 'employeeId',
        as: 'entryExitRequests'
      });
      
      Employee.hasMany(models.Announcement, {
        foreignKey: 'createdBy',
        as: 'announcements'
      });
    }

    async comparePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }
  
  Employee.init({
    employeeId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 20]
      }
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    phoneNumber: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: true,
        isNumeric: true,
        len: [10, 15]
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255]
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'employee'),
      defaultValue: 'employee'
    },
    divisionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true
      }
    },
    positionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true
      }
    },
    workShiftId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'Employees',
    hooks: {
      beforeCreate: async (employee) => {
        if (employee.password) {
          employee.password = await bcrypt.hash(employee.password, 10);
        }
      },
      beforeUpdate: async (employee) => {
        if (employee.changed('password')) {
          employee.password = await bcrypt.hash(employee.password, 10);
        }
      }
    }
  });
  
  return Employee;
};