// seeders/xxxx-demo-employees.js
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('daffa123', 10);
    
    await queryInterface.bulkInsert('Employees', [
      {
        employeeId: 'admin',
        fullName: 'Administrator',
        phoneNumber: '081234567890',
        password: hashedPassword,
        role: 'admin',
        divisionId: 1, // HR
        positionId: 1, // Manager
        workShiftId: 1, // Shift Pagi
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        employeeId: 'hr',
        fullName: 'Siti Nurhaliza',
        phoneNumber: '081234567891',
        password: hashedPassword,
        role: 'employee',
        divisionId: 1, // HR
        positionId: 3, // Staff
        workShiftId: 1, // Shift Pagi
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        employeeId: 'it',
        fullName: 'Budi Santoso',
        phoneNumber: '081234567892',
        password: hashedPassword,
        role: 'employee',
        divisionId: 2, // IT
        positionId: 4, // Senior Staff
        workShiftId: 1, // Shift Pagi
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employees', null, {});
  }
};