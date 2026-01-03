const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const category = new Category(req.body);
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    // Assuming category ID is the mongo _id. If the schema uses a custom 'id' field, we need to query by that.
    // The current schema uses 'id' field for string IDs like 'landscape'.
    // So let's try to find by _id first, if not valid objectId, find by 'id'.
    // Or, since frontend might send _id if we list them from DB, let's stick to _id for updates.
    // Wait, the seed script uses 'id'.
    
    const category = await Category.findById(req.params.id);
    if (category) {
      Object.assign(category, req.body);
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
       // fallback for custom string id if we want, but usually admins edit by DB ID
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Seed categories
// @route   POST /api/categories/seed
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    await Category.deleteMany({});
    
    const dataPath = path.join(__dirname, '../../src/data/categories.json');
    const categoriesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    // categories.json has 'id' like 'landscape'. My schema has 'id' field.
    // So I can keep it.
    
    const createdCategories = await Category.insertMany(categoriesData);
    res.json(createdCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
