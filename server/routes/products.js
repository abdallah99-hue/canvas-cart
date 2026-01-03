const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Seed products
// @route   POST /api/products/seed
// @access  Public (should be private/protected in production)
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    
    // Read data from src/data/products.json
    const dataPath = path.join(__dirname, '../../src/data/products.json');
    const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    // Remove 'id' field as mongo adds _id, or map it if we want to preserve string ids? 
    // The frontend expects 'id'. Mongo uses '_id'.
    // The json data has 'id': '1'. 
    // If we let mongo generate _id, we need to handle the mismatch or ensure frontend uses _id.
    // For simplicity, let's let mongo generate _id, and we can map it when sending back or just use _id in frontend.
    // However, the current frontend uses string IDs like '1', '2'. 
    // If I change to mongo _id, links like /products/1 will break unless I keep 'id' field as a custom field or update links.
    // The schema I created didn't have 'id' field, just 'sku' and mongo's '_id'.
    // Let's rely on _id. I will need to update frontend to use _id.
    
    const productsToInsert = productsData.map(p => {
      const { id, ...rest } = p; // remove string id
      return rest;
    });

    const createdProducts = await Product.insertMany(productsToInsert);
    res.json(createdProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
