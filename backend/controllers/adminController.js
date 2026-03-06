const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all complaints (Admin)
// @route   GET /api/admin/complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate('category', 'name')
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, total, page: parseInt(page), complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get analytics/dashboard stats
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const [totalComplaints, pending, inProgress, resolved, closed, rejected] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'Closed' }),
      Complaint.countDocuments({ status: 'Rejected' }),
    ]);

    const totalUsers = await User.countDocuments({ role: { $in: ['user', 'admin'] } });

    // Complaints by category
    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
      { $unwind: { path: '$cat', preserveNullAndEmpty: true } },
      { $project: { name: { $ifNull: ['$cat.name', 'Unknown'] }, count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    // Complaints by priority
    const byPriority = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Complaint.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Average resolution time
    const resolvedComplaints = await Complaint.find({
      status: { $in: ['Resolved', 'Closed'] },
      resolvedAt: { $ne: null },
    }).select('createdAt resolvedAt');

    let avgResolutionTime = 0;
    if (resolvedComplaints.length > 0) {
      const totalMs = resolvedComplaints.reduce(
        (sum, c) => sum + (c.resolvedAt - c.createdAt),
        0
      );
      avgResolutionTime = Math.round(totalMs / resolvedComplaints.length / (1000 * 60 * 60)); // hours
    }

    res.json({
      success: true,
      stats: {
        totalComplaints,
        pending,
        inProgress,
        resolved,
        closed,
        rejected,
        totalUsers,
        avgResolutionTime,
      },
      byCategory,
      byPriority,
      monthlyTrend,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
