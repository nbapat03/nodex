const Complaint = require('../models/Complaint');
const User = require('../models/User');

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

exports.getAnalytics = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const closed = await Complaint.countDocuments({ status: 'Closed' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });
    const totalUsers = await User.countDocuments();

    let byCategory = [];
    try {
      byCategory = await Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
        { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ['$cat.name', 'Unknown'] }, count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]);
    } catch (e) { console.error('byCategory error:', e.message); }

    let byPriority = [];
    try {
      byPriority = await Complaint.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
      ]);
    } catch (e) { console.error('byPriority error:', e.message); }

    let monthlyTrend = [];
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      monthlyTrend = await Complaint.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);
    } catch (e) { console.error('monthlyTrend error:', e.message); }

    let avgResolutionTime = 0;
    try {
      const resolvedComplaints = await Complaint.find({
        status: { $in: ['Resolved', 'Closed'] },
        resolvedAt: { $ne: null },
      }).select('createdAt resolvedAt');
      if (resolvedComplaints.length > 0) {
        const totalMs = resolvedComplaints.reduce(
          (sum, c) => sum + (new Date(c.resolvedAt) - new Date(c.createdAt)), 0
        );
        avgResolutionTime = Math.round(totalMs / resolvedComplaints.length / (1000 * 60 * 60));
      }
    } catch (e) { console.error('avgResolution error:', e.message); }

    res.json({
      success: true,
      stats: { totalComplaints, pending, inProgress, resolved, closed, rejected, totalUsers, avgResolutionTime },
      byCategory,
      byPriority,
      monthlyTrend,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};