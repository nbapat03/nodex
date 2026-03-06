const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAllComplaints, getAnalytics, getAllUsers } = require('../controllers/adminController');

router.use(protect, authorize('admin', 'superadmin'));

router.get('/complaints', getAllComplaints);
router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);

module.exports = router;
