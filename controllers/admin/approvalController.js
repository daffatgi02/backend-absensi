const { EmployeeVisit, EntryExitRequest, Employee } = require('../../models');
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../../middlewares/validation');

class ApprovalController {
  static approvalValidation = [
    param('id').isInt().withMessage('Invalid ID'),
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
    body('notes').optional().isLength({ max: 500 }).withMessage('Notes too long')
  ];

  async approveVisit(req, res, next) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const visit = await EmployeeVisit.findByPk(id);
      if (!visit) {
        return res.error('Visit request not found', 404);
      }

      await visit.update({
        status,
        notes,
        approvedBy: req.user.id,
        approvedAt: new Date()
      });

      res.success(visit, `Visit request ${status} successfully`);
    } catch (error) {
      next(error);
    }
  }

  async approveEntryExit(req, res, next) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const request = await EntryExitRequest.findByPk(id);
      if (!request) {
        return res.error('Entry/Exit request not found', 404);
      }

      await request.update({
        status,
        notes,
        approvedBy: req.user.id,
        approvedAt: new Date()
      });

      res.success(request, `Entry/Exit request ${status} successfully`);
    } catch (error) {
      next(error);
    }
  }

  async getPendingVisits(req, res, next) {
    try {
      const visits = await EmployeeVisit.findAll({
        where: { status: 'pending' },
        include: [{
          model: Employee,
          as: 'employee',
          attributes: ['employeeId', 'fullName']
        }],
        order: [['createdAt', 'DESC']]
      });

      res.success(visits, 'Pending visits retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getPendingEntryExit(req, res, next) {
    try {
      const requests = await EntryExitRequest.findAll({
        where: { status: 'pending' },
        include: [{
          model: Employee,
          as: 'employee',
          attributes: ['employeeId', 'fullName']
        }],
        order: [['createdAt', 'DESC']]
      });

      res.success(requests, 'Pending entry/exit requests retrieved');
    } catch (error) {
      next(error);
    }
  }
}

const approvalController = new ApprovalController();
approvalController.approvalValidation = ApprovalController.approvalValidation;
approvalController.handleValidationErrors = handleValidationErrors;

module.exports = approvalController;