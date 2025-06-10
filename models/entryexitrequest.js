'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EntryExitRequest extends Model {
    static associate(models) {
      EntryExitRequest.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'employee'
      });
      
      EntryExitRequest.belongsTo(models.Employee, {
        foreignKey: 'approvedBy',
        as: 'approver'
      });
    }
  }
  
  EntryExitRequest.init({
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('entry', 'exit'),
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    modelName: 'EntryExitRequest',
    tableName: 'EntryExitRequests'
  });
  
  return EntryExitRequest;
};