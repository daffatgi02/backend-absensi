const express = require('express');
const router = express.Router();

// Auth routes
router.use('/auth', require('./auth'));

// Admin routes
router.use('/admin/dashboard', require('./admin/dashboard'));
router.use('/admin/employees', require('./admin/employee'));
router.use('/admin/divisions', require('./admin/division'));
router.use('/admin/positions', require('./admin/position'));
router.use('/admin/work-shifts', require('./admin/workShift'));
router.use('/admin/announcements', require('./admin/announcement'));
router.use('/admin/reports', require('./admin/report'));

// User routes
router.use('/user/dashboard', require('./user/dashboard'));
router.use('/user/profile', require('./user/profile'));
router.use('/user/visits', require('./user/visit'));
router.use('/user/entry-exit', require('./user/entryExit'));

// API documentation endpoint
router.get('/', (req, res) => {
  res.success({
    message: 'Employee Management System API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /auth/login',
        logout: 'POST /auth/logout',
        profile: 'GET /auth/profile'
      },
      admin: {
        dashboard: 'GET /admin/dashboard/stats',
        employees: 'CRUD /admin/employees',
        divisions: 'CRUD /admin/divisions',
        positions: 'CRUD /admin/positions',
        workShifts: 'CRUD /admin/work-shifts',
        announcements: 'CRUD /admin/announcements',
        reports: 'GET /admin/reports/*'
      },
      user: {
        dashboard: 'GET /user/dashboard',
        profile: 'GET/PUT /user/profile',
        visits: 'CRUD /user/visits',
        entryExit: 'CRUD /user/entry-exit'
      }
    }
  }, 'Employee Management System API v1.0.0');
});

module.exports = router;