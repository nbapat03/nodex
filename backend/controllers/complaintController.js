const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

// Helper to create notification
const createNotification = async (recipientId, complaintId, message, type) => {
  try {
    await Notification.create({ recipient: recipientId, complaint: complaintId, message, type });
  } catch (e) {
    console.error('Notification error:', e.message);
  }
};

// @desc    Submit a new complaint
// @route   POST /api/complaints
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      submittedBy: req.user.id,
      statusHistory: [{ status: 'Pending', changedBy: req.user.id, note: 'Complaint submitted' }],
    });

    await complaint.populate(['category', 'submittedBy']);
    res.status(201).json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all complaints for logged-in user
// @route   GET /api/complaints/my
exports.getMyComplaints = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const filter = { submittedBy: req.user.id };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate('category', 'name')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, total, page: parseInt(page), complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('category', 'name')
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Users can only see their own complaints
    if (req.user.role === 'user' && complaint.submittedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update complaint status (Admin)
// @route   PATCH /api/complaints/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.statusHistory.push({ status, changedBy: req.user.id, note: note || '' });

    if (status === 'Resolved') complaint.resolvedAt = new Date();
    if (status === 'Closed') complaint.closedAt = new Date();

    await complaint.save();
    await complaint.populate(['category', 'submittedBy', 'assignedTo']);

    // Notify the complainant
    await createNotification(
      complaint.submittedBy._id,
      complaint._id,
      `Your complaint "${complaint.title}" status has been updated to ${status}.`,
      'status_update'
    );

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Assign complaint to admin (Admin)
// @route   PATCH /api/complaints/:id/assign
exports.assignComplaint = async (req, res) => {
  try {
    const { adminId } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: adminId, status: 'In Progress' },
      { new: true }
    )
      .populate('category', 'name')
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.statusHistory.push({
      status: 'In Progress',
      changedBy: req.user.id,
      note: `Assigned to ${complaint.assignedTo?.name || 'admin'}`,
    });
    await complaint.save();

    await createNotification(
      complaint.submittedBy._id,
      complaint._id,
      `Your complaint "${complaint.title}" has been assigned and is now In Progress.`,
      'assignment'
    );

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
