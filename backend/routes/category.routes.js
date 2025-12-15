const express = require('express')
const {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
} = require('../controllers/category.controller')

const router = express.Router()

/**
 * Public category routes
 */

// Get category by slug - must come before /:id
router.get('/slug/:slug', getCategoryBySlug)

// Get all categories
router.get('/', getAllCategories)

// Get category by ID
router.get('/:id', getCategoryById)

module.exports = router
