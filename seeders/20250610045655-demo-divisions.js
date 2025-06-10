'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Divisions', [
      {
        name: 'Human Resources',
        description: 'Mengelola SDM dan administrasi karyawan',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Information Technology',
        description: 'Mengelola sistem informasi dan teknologi',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sales & Marketing',
        description: 'Mengelola penjualan dan pemasaran',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Production',
        description: 'Mengelola produksi dan operasional',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Finance & Accounting',
        description: 'Mengelola keuangan dan akuntansi',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Divisions', null, {});
  }
};