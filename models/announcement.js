'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Announcement extends Model {
    static associate(models) {
      Announcement.belongsTo(models.Employee, {
        foreignKey: 'createdBy',
        as: 'creator'
      });
    }
  }
  
  Announcement.init({
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 200]
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    targetType: {
      type: DataTypes.ENUM('all', 'division', 'individual'),
      defaultValue: 'all'
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Announcement',
    tableName: 'Announcements'
  });
  
  return Announcement;
};