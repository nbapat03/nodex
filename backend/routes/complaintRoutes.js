const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createComplaint,
  getMyComplaints,
  getComplaint,
  updateStatus,
  assignComplaint,
} = require('../controllers/complaintController');

router.post('/', protect, createComplaint);
router.get('/my', protect, getMyComplaints);
router.get('/:id', protect, getComplaint);
router.patch('/:id/status', protect, authorize('admin', 'superadmin'), updateStatus);
router.patch('/:id/assign', protect, authorize('admin', 'superadmin'), assignComplaint);

module.exports = router;
