'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WorkShift extends Model {
    static associate(models) {
      WorkShift.hasMany(models.Employee, {
        foreignKey: 'workShiftId',
        as: 'employees'
      });
    }
  }
  
  WorkShift.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'WorkShift',
    tableName: 'WorkShifts'
  });
  
  return WorkShift;
};