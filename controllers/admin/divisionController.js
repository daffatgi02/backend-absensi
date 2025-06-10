const { body, param } = require('express-validator');
const { Division } = require('../../models');
const { handleValidationErrors } = require('../../middlewares/validation');

class DivisionController {
  static validation = [
    body('name')
      .notEmpty()
      .withMessage('Division name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Division name must be between 2-100 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
  ];

  async getAll(req, res, next) {
    try {
      const divisions = await Division.findAll({
        where: { isActive: true },
        order: [['name', 'ASC']]
      });
      
      res.success(divisions, 'Divisions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      
      const division = await Division.findByPk(id);
      
      if (!division) {
        return res.error('Division not found', 404);
      }
      
      res.success(division, 'Division retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const division = await Division.create(req.body);
      
      res.success(division, 'Division created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      
      const division = await Division.findByPk(id);
      
      if (!division) {
        return res.error('Division not found', 404);
      }
      
      await division.update(req.body);
      
      res.success(division, 'Division updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      const division = await Division.findByPk(id);
      
      if (!division) {
        return res.error('Division not found', 404);
      }
      
      await division.update({ isActive: false });
      
      res.success(null, 'Division deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

const divisionController = new DivisionController();
divisionController.validation = DivisionController.validation;
divisionController.handleValidationErrors = handleValidationErrors;

module.exports = divisionController;