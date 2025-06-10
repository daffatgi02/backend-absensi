'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeeVisit extends Model {
    static associate(models) {
      EmployeeVisit.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'employee'
      });
      
      EmployeeVisit.belongsTo(models.Employee, {
        foreignKey: 'approvedBy',
        as: 'approver'
      });
    }
  }
  
  EmployeeVisit.init({
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    visitDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    purpose: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    attachmentPath: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'EmployeeVisit',
    tableName: 'EmployeeVisits'
  });
  
  return EmployeeVisit;
};