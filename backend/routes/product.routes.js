const express = require('express')
const {
  getAllProducts,
  getProductById,
  getProductBySlug,
  searchProducts,
  getFeaturedProducts,
  getRelatedProducts,
} = require('../controllers/product.controller')
const { optionalAuth } = require('../middleware/auth.middleware')

const router = express.Router()

/**
 * Public product routes
 */

// Featured products - must come before /:id to avoid route conflict
router.get('/featured', getFeaturedProducts)

// Search products
router.get('/search', searchProducts)

// Get product by slug - must come before /:id
router.get('/slug/:slug', optionalAuth, getProductBySlug)

// Get all products with filtering
router.get('/', getAllProducts)

// Get product by ID
router.get('/:id', optionalAuth, getProductById)

// Get related products
router.get('/:id/related', getRelatedProducts)

module.exports = router
