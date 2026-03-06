const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');

router.get('/', protect, async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .populate('complaint', 'complaintId title status')
    .sort({ createdAt: -1 })
    .limit(50);
  const unreadCount = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
  res.json({ success: true, notifications, unreadCount });
});

router.patch('/mark-read', protect, async (req, res) => {
  await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All notifications marked as read' });
});

router.patch('/:id/read', protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

module.exports = router;
