'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'employee'
      });
    }
  }
  
  Attendance.init({
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    checkIn: {
      type: DataTypes.TIME,
      allowNull: true
    },
    checkOut: {
      type: DataTypes.TIME,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'early_leave'),
      defaultValue: 'present'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'Attendances'
  });
  
  return Attendance;
};