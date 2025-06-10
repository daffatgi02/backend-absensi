const { body, param } = require('express-validator');
const { Position } = require('../../models');
const { handleValidationErrors } = require('../../middlewares/validation');

class PositionController {
  static validation = [
    body('name')
      .notEmpty()
      .withMessage('Position name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Position name must be between 2-100 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
  ];

  async getAll(req, res, next) {
    try {
      const positions = await Position.findAll({
        where: { isActive: true },
        order: [['name', 'ASC']]
      });
      
      res.success(positions, 'Positions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      
      const position = await Position.findByPk(id);
      
      if (!position) {
        return res.error('Position not found', 404);
      }
      
      res.success(position, 'Position retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const position = await Position.create(req.body);
      
      res.success(position, 'Position created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      
      const position = await Position.findByPk(id);
      
      if (!position) {
        return res.error('Position not found', 404);
      }
      
      await position.update(req.body);
      
      res.success(position, 'Position updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      const position = await Position.findByPk(id);
      
      if (!position) {
        return res.error('Position not found', 404);
      }
      
      await position.update({ isActive: false });
      
      res.success(null, 'Position deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

const positionController = new PositionController();
positionController.validation = PositionController.validation;
positionController.handleValidationErrors = handleValidationErrors;

module.exports = positionController;