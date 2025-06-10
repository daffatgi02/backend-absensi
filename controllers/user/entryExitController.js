const { body, param } = require('express-validator');
const { EntryExitRequest, Employee } = require('../../models');
const { handleValidationErrors } = require('../../middlewares/validation');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/entry-exit/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'entry-exit-' + uniqueSuffix + path.extname(file.originalname));
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

class EntryExitController {
  static createValidation = [
    body('requestDate')
      .notEmpty()
      .withMessage('Request date is required')
      .isISO8601()
      .withMessage('Request date must be a valid date'),
    body('type')
      .notEmpty()
      .withMessage('Type is required')
      .isIn(['entry', 'exit'])
      .withMessage('Type must be entry or exit'),
    body('reason')
      .notEmpty()
      .withMessage('Reason is required')
      .isLength({ min: 10 })
      .withMessage('Reason must be at least 10 characters'),
    body('location')
      .optional()
      .isLength({ min: 3, max: 255 })
      .withMessage('Location must be between 3-255 characters')
  ];

  static updateValidation = [
    param('id').isInt().withMessage('Invalid request ID'),
    body('requestDate')
      .optional()
      .isISO8601()
      .withMessage('Request date must be a valid date'),
    body('type')
      .optional()
      .isIn(['entry', 'exit'])
      .withMessage('Type must be entry or exit'),
    body('reason')
      .optional()
      .isLength({ min: 10 })
      .withMessage('Reason must be at least 10 characters'),
    body('location')
      .optional()
      .isLength({ min: 3, max: 255 })
      .withMessage('Location must be between 3-255 characters')
  ];

  async getAll(req, res, next) {
    try {
      const employeeId = req.user.id;
      const { page = 1, limit = 20, status, type, startDate, endDate } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = { employeeId };
      
      if (status) {
        whereClause.status = status;
      }
      
      if (type) {
        whereClause.type = type;
      }
      
      if (startDate && endDate) {
        whereClause.requestDate = {
          [Op.between]: [startDate, endDate]
        };
      }

      const requests = await EntryExitRequest.findAndCountAll({
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
        requests: requests.rows,
        pagination: {
          total: requests.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(requests.count / limit)
        }
      }, 'Entry exit requests retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const employeeId = req.user.id;
      
      const request = await EntryExitRequest.findOne({
        where: { id, employeeId },
        include: [
          {
            model: Employee,
            as: 'approver',
            attributes: ['fullName']
          }
        ]
      });
      
      if (!request) {
        return res.error('Entry exit request not found', 404);
      }
      
      res.success(request, 'Entry exit request retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const requestData = {
        ...req.body,
        employeeId: req.user.id,
        attachmentPath: req.file ? req.file.path : null
      };

      const request = await EntryExitRequest.create(requestData);
      
      res.success(request, 'Entry exit request created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const employeeId = req.user.id;
      
      const request = await EntryExitRequest.findOne({
        where: { id, employeeId }
      });
      
      if (!request) {
        return res.error('Entry exit request not found', 404);
      }

      // Only allow updates if status is pending
      if (request.status !== 'pending') {
        return res.error('Cannot update request that has been processed', 400);
      }

      const updateData = { ...req.body };
      if (req.file) {
        updateData.attachmentPath = req.file.path;
      }
      
      await request.update(updateData);
      
      res.success(request, 'Entry exit request updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const employeeId = req.user.id;
      
      const request = await EntryExitRequest.findOne({
        where: { id, employeeId }
      });
      
      if (!request) {
        return res.error('Entry exit request not found', 404);
      }

      // Only allow deletion if status is pending
      if (request.status !== 'pending') {
        return res.error('Cannot delete request that has been processed', 400);
      }
      
      await request.destroy();
      
      res.success(null, 'Entry exit request deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

const entryExitController = new EntryExitController();
entryExitController.createValidation = EntryExitController.createValidation;
entryExitController.updateValidation = EntryExitController.updateValidation;
entryExitController.handleValidationErrors = handleValidationErrors;
entryExitController.upload = upload;

module.exports = entryExitController;