'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      fullName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'employee'),
        defaultValue: 'employee'
      },
      divisionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Divisions',
          key: 'id'
        }
      },
      positionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Positions',
          key: 'id'
        }
      },
      workShiftId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'WorkShifts',
          key: 'id'
        }
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Employees');
  }
};