const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const {
  getAllComplaints,
  getAnalytics,
  getAllUsers,
  deleteUser
} = require('../controllers/adminController');

router.use(protect, authorize('admin', 'superadmin'));

router.get('/complaints', getAllComplaints);
router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);

/*delete user */
router.delete('/users/:id', deleteUser);

module.exports = router;