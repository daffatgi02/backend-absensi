const express = require('express');
const router = express.Router();
const approvalController = require('../../controllers/admin/approvalController');
const { authenticate, authorize } = require('../../middlewares/auth');

router.use(authenticate);
router.use(authorize(['admin']));

// Get pending requests
router.get('/visits/pending', approvalController.getPendingVisits);
router.get('/entry-exit/pending', approvalController.getPendingEntryExit);

// Approve/Reject visits
router.patch('/visits/:id',
  approvalController.approvalValidation,
  approvalController.handleValidationErrors,
  approvalController.approveVisit
);

// Approve/Reject entry-exit
router.patch('/entry-exit/:id',
  approvalController.approvalValidation,
  approvalController.handleValidationErrors,
  approvalController.approveEntryExit
);

module.exports = router;