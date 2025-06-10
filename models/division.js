'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Division extends Model {
    static associate(models) {
      Division.hasMany(models.Employee, {
        foreignKey: 'divisionId',
        as: 'employees'
      });
    }
  }
  
  Division.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Division',
    tableName: 'Divisions'
  });
  
  return Division;
};