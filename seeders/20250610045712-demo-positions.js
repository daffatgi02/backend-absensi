'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Positions', [
      {
        name: 'Manager',
        description: 'Mengelola dan mengawasi tim',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Supervisor',
        description: 'Mengawasi operasional harian',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Staff',
        description: 'Melaksanakan tugas operasional',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Senior Staff',
        description: 'Staff dengan pengalaman lebih',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Junior Staff',
        description: 'Staff pemula',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Positions', null, {});
  }
};