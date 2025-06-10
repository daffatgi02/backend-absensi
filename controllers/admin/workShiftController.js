const { body, param } = require('express-validator');
const { WorkShift } = require('../../models');
const { handleValidationErrors } = require('../../middlewares/validation');

class WorkShiftController {
  static validation = [
    body('name')
      .notEmpty()
      .withMessage('Work shift name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Work shift name must be between 2-100 characters'),
    body('startTime')
      .notEmpty()
      .withMessage('Start time is required')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Start time must be in HH:MM format'),
    body('endTime')
      .notEmpty()
      .withMessage('End time is required')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('End time must be in HH:MM format')
  ];

  async getAll(req, res, next) {
    try {
      const workShifts = await WorkShift.findAll({
        where: { isActive: true },
        order: [['startTime', 'ASC']]
      });
      
      res.success(workShifts, 'Work shifts retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      
      const workShift = await WorkShift.findByPk(id);
      
      if (!workShift) {
        return res.error('Work shift not found', 404);
      }
      
      res.success(workShift, 'Work shift retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      // Validate that start time is before end time
      const { startTime, endTime } = req.body;
      if (startTime >= endTime) {
        return res.error('Start time must be before end time', 400);
      }

      const workShift = await WorkShift.create(req.body);
      
      res.success(workShift, 'Work shift created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      
      const workShift = await WorkShift.findByPk(id);
      
      if (!workShift) {
        return res.error('Work shift not found', 404);
      }

      // Validate that start time is before end time
      const { startTime, endTime } = req.body;
      if (startTime && endTime && startTime >= endTime) {
        return res.error('Start time must be before end time', 400);
      }
      
      await workShift.update(req.body);
      
      res.success(workShift, 'Work shift updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      const workShift = await WorkShift.findByPk(id);
      
      if (!workShift) {
        return res.error('Work shift not found', 404);
      }
      
      await workShift.update({ isActive: false });
      
      res.success(null, 'Work shift deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

const workShiftController = new WorkShiftController();
workShiftController.validation = WorkShiftController.validation;
workShiftController.handleValidationErrors = handleValidationErrors;

module.exports = workShiftController;