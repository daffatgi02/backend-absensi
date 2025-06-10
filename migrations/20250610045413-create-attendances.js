'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Employees',
          key: 'id'
        }
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      checkIn: {
        type: Sequelize.TIME,
        allowNull: true
      },
      checkOut: {
        type: Sequelize.TIME,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('present', 'absent', 'late', 'early_leave'),
        defaultValue: 'present'
      },
      notes: {
        type: Sequelize.TEXT,
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

    // Add unique constraint for employee per date
    await queryInterface.addIndex('Attendances', ['employeeId', 'date'], {
      unique: true,
      name: 'unique_employee_date'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Attendances');
  }
};