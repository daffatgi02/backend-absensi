const { body, param, query } = require('express-validator');
const announcementService = require('../../services/announcementService');
const { handleValidationErrors } = require('../../middlewares/validation');

class AnnouncementController {
  static createValidation = [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 5, max: 200 })
      .withMessage('Title must be between 5-200 characters'),
    body('content')
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ min: 10 })
      .withMessage('Content must be at least 10 characters'),
    body('targetType')
      .optional()
      .isIn(['all', 'division', 'individual'])
      .withMessage('Target type must be all, division, or individual'),
    body('targetId')
      .optional()
      .isInt()
      .withMessage('Target ID must be a number'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('expiresAt')
      .optional()
      .isISO8601()
      .withMessage('Expires at must be a valid date')
  ];

  static updateValidation = [
    param('id').isInt().withMessage('Invalid announcement ID'),
    body('title')
      .optional()
      .isLength({ min: 5, max: 200 })
      .withMessage('Title must be between 5-200 characters'),
    body('content')
      .optional()
      .isLength({ min: 10 })
      .withMessage('Content must be at least 10 characters'),
    body('targetType')
      .optional()
      .isIn(['all', 'division', 'individual'])
      .withMessage('Target type must be all, division, or individual'),
    body('targetId')
      .optional()
      .isInt()
      .withMessage('Target ID must be a number'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('expiresAt')
      .optional()
      .isISO8601()
      .withMessage('Expires at must be a valid date')
  ];

  async getAll(req, res, next) {
    try {
      const filters = {
        targetType: req.query.targetType,
        priority: req.query.priority,
        isActive: req.query.isActive,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit
      };

      const announcements = await announcementService.getAllAnnouncements(filters);
      
      res.success(announcements, 'Announcements retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      
      const announcement = await announcementService.getAnnouncementById(id);
      
      res.success(announcement, 'Announcement retrieved successfully');
    } catch (error) {
      if (error.message === 'Announcement not found') {
        return res.error('Announcement not found', 404);
      }
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const announcementData = {
        ...req.body,
        createdBy: req.user.id
      };

      const announcement = await announcementService.createAnnouncement(announcementData);
      
      res.success(announcement, 'Announcement created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      
      const announcement = await announcementService.updateAnnouncement(id, req.body);
      
      res.success(announcement, 'Announcement updated successfully');
    } catch (error) {
      if (error.message === 'Announcement not found') {
        return res.error('Announcement not found', 404);
      }
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      await announcementService.deleteAnnouncement(id);
      
      res.success(null, 'Announcement deleted successfully');
    } catch (error) {
      if (error.message === 'Announcement not found') {
        return res.error('Announcement not found', 404);
      }
      next(error);
    }
  }

  async publish(req, res, next) {
    try {
      const { id } = req.params;
      
      const announcement = await announcementService.publishAnnouncement(id);
      
      res.success(announcement, 'Announcement published successfully');
    } catch (error) {
      if (error.message === 'Announcement not found') {
        return res.error('Announcement not found', 404);
      }
      next(error);
    }
  }
}

const announcementController = new AnnouncementController();
announcementController.createValidation = AnnouncementController.createValidation;
announcementController.updateValidation = AnnouncementController.updateValidation;
announcementController.handleValidationErrors = handleValidationErrors;

module.exports = announcementController;