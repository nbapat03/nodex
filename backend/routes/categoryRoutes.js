const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Category = require('../models/Category');

router.get('/', protect, async (req, res) => {
  const cats = await Category.find({ isActive: true });
  res.json({ success: true, categories: cats });
});

router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json({ success: true, category: cat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Category deactivated' });
});

module.exports = router;
