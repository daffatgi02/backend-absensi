const { body, param } = require('express-validator');
const { EmployeeVisit, Employee } = require('../../models');
const { handleValidationErrors } = require('../../middlewares/validation');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/visits/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'visit-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg and .pdf files are allowed!'));
    }
  }
});

class VisitController {
  static createValidation = [
    body('visitDate')
      .notEmpty()
      .withMessage('Visit date is required')
      .isISO8601()
      .withMessage('Visit date must be a valid date'),
    body('location')
      .notEmpty()
      .withMessage('Location is required')
      .isLength({ min: 5, max: 255 })
      .withMessage('Location must be between 5-255 characters'),
    body('purpose')
      .notEmpty()
      .withMessage('Purpose is required')
      .isLength({ min: 10 })
      .withMessage('Purpose must be at least 10 characters')
  ];

  static updateValidation = [
    param('id').isInt().withMessage('Invalid visit ID'),
    body('visitDate')
      .optional()
      .isISO8601()
      .withMessage('Visit date must be a valid date'),
    body('location')
      .optional()
      .isLength({ min: 5, max: 255 })
      .withMessage('Location must be between 5-255 characters'),
    body('purpose')
      .optional()
      .isLength({ min: 10 })
      .withMessage('Purpose must be at least 10 characters')
  ];

  async getAll(req, res, next) {
    try {
      const employeeId = req.user.id;
      const { page = 1, limit = 20, status, startDate, endDate } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = { employeeId };
      
      if (status) {
        whereClause.status = status;
      }
      
      if (startDate && endDate) {
        whereClause.visitDate = {
          [Op.between]: [startDate, endDate]
        };
      }

      const visits = await EmployeeVisit.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Employee,
            as: 'approver',
            attributes: ['fullName']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.success({
        visits: visits.rows,
        pagination: {
          total: visits.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(visits.count / limit)
        }
      }, 'Visits retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const employeeId = req.user.id;
      
      const visit = await EmployeeVisit.findOne({
        where: { id, employeeId },
        include: [
          {
            model: Employee,
            as: 'approver',
            attributes: ['fullName']
          }
        ]
      });
      
      if (!visit) {
        return res.error('Visit not found', 404);
      }
      
      res.success(visit, 'Visit retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const visitData = {
        ...req.body,
        employeeId: req.user.id,
        attachmentPath: req.file ? req.file.path : null
      };

      const visit = await EmployeeVisit.create(visitData);
      
      res.success(visit, 'Visit request created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const employeeId = req.user.id;
      
      const visit = await EmployeeVisit.findOne({
        where: { id, employeeId }
      });
      
      if (!visit) {
        return res.error('Visit not found', 404);
      }

      // Only allow updates if status is pending
      if (visit.status !== 'pending') {
        return res.error('Cannot update visit request that has been processed', 400);
      }

      const updateData = { ...req.body };
      if (req.file) {
        updateData.attachmentPath = req.file.path;
      }
      
      await visit.update(updateData);
      
      res.success(visit, 'Visit request updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const employeeId = req.user.id;
      
      const visit = await EmployeeVisit.findOne({
        where: { id, employeeId }
      });
      
      if (!visit) {
        return res.error('Visit not found', 404);
      }

      // Only allow deletion if status is pending
      if (visit.status !== 'pending') {
        return res.error('Cannot delete visit request that has been processed', 400);
      }
      
      await visit.destroy();
      
      res.success(null, 'Visit request deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

const visitController = new VisitController();
visitController.createValidation = VisitController.createValidation;
visitController.updateValidation = VisitController.updateValidation;
visitController.handleValidationErrors = handleValidationErrors;
visitController.upload = upload;

module.exports = visitController;