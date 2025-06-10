// seeders/xxxx-demo-work-shifts.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('WorkShifts', [
      {
        name: 'Shift Pagi',
        startTime: '08:00:00',
        endTime: '17:00:00',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Shift Siang',
        startTime: '13:00:00',
        endTime: '22:00:00',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Shift Malam',
        startTime: '22:00:00',
        endTime: '07:00:00',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('WorkShifts', null, {});
  }
};