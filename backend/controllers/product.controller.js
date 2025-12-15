const { Product, Category, Review } = require('../models')
const { successResponse, errorResponse } = require('../utils/helpers')
const { Op } = require('sequelize')

/**
 * Get all products with filtering and pagination
 * GET /api/products
 */
const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      categoryId,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'DESC',
      isFeatured,
      isActive = true,
    } = req.query

    // Build where clause
    const where = { isActive }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice)
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice)
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true'
    }

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit)

    // Query products
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order.toUpperCase()]],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
        },
      ],
      attributes: { exclude: ['customizationOptions'] }, // Exclude heavy fields from list view
    })

    const totalPages = Math.ceil(count / parseInt(limit))

    return successResponse(
      res,
      {
        products,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
        },
      },
      'Products retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get single product by ID
 * GET /api/products/:id
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'description'],
        },
        {
          model: Review,
          as: 'reviews',
          limit: 5,
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'rating', 'comment', 'createdAt', 'userId'],
        },
      ],
    })

    if (!product) {
      throw errorResponse('Product not found', 404)
    }

    if (!product.isActive) {
      throw errorResponse('Product is not available', 404)
    }

    return successResponse(res, { product }, 'Product retrieved successfully')
  } catch (error) {
    next(error)
  }
}

/**
 * Get product by slug
 * GET /api/products/slug/:slug
 */
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params

    const product = await Product.findOne({
      where: { slug, isActive: true },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'description'],
        },
        {
          model: Review,
          as: 'reviews',
          limit: 5,
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'rating', 'comment', 'createdAt', 'userId'],
        },
      ],
    })

    if (!product) {
      throw errorResponse('Product not found', 404)
    }

    return successResponse(res, { product }, 'Product retrieved successfully')
  } catch (error) {
    next(error)
  }
}

/**
 * Search products by name/description
 * GET /api/products/search
 */
const searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 12 } = req.query

    if (!q || q.trim().length === 0) {
      throw errorResponse('Search query is required', 400)
    }

    const searchTerm = q.trim()
    const offset = (parseInt(page) - 1) * parseInt(limit)

    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `%${searchTerm}%` } },
          { sku: { [Op.iLike]: `%${searchTerm}%` } },
        ],
      },
      limit: parseInt(limit),
      offset,
      order: [['name', 'ASC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
        },
      ],
      attributes: { exclude: ['customizationOptions'] },
    })

    const totalPages = Math.ceil(count / parseInt(limit))

    return successResponse(
      res,
      {
        products,
        searchTerm,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
        },
      },
      'Search completed successfully'
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get featured products
 * GET /api/products/featured
 */
const getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query

    const products = await Product.findAll({
      where: {
        isFeatured: true,
        isActive: true,
      },
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
        },
      ],
      attributes: { exclude: ['customizationOptions'] },
    })

    return successResponse(
      res,
      { products },
      'Featured products retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get related products (same category)
 * GET /api/products/:id/related
 */
const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params
    const { limit = 4 } = req.query

    // Get the product to find its category
    const product = await Product.findByPk(id)

    if (!product) {
      throw errorResponse('Product not found', 404)
    }

    // Find related products in same category
    const products = await Product.findAll({
      where: {
        categoryId: product.categoryId,
        id: { [Op.ne]: id }, // Exclude current product
        isActive: true,
      },
      limit: parseInt(limit),
      order: [['rating', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
        },
      ],
      attributes: { exclude: ['customizationOptions'] },
    })

    return successResponse(
      res,
      { products },
      'Related products retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  searchProducts,
  getFeaturedProducts,
  getRelatedProducts,
}
