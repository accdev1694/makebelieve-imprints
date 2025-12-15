const { Category, Product } = require('../models')
const { successResponse, errorResponse } = require('../utils/helpers')

/**
 * Get all categories
 * GET /api/categories
 */
const getAllCategories = async (req, res, next) => {
  try {
    const { includeProducts = false } = req.query

    const queryOptions = {
      where: { isActive: true },
      order: [['name', 'ASC']],
    }

    if (includeProducts === 'true') {
      queryOptions.include = [
        {
          model: Product,
          as: 'products',
          where: { isActive: true },
          required: false,
          attributes: ['id', 'name', 'slug', 'price', 'images'],
          limit: 4,
        },
      ]
    }

    const categories = await Category.findAll(queryOptions)

    return successResponse(
      res,
      { categories },
      'Categories retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get category by ID with products
 * GET /api/categories/:id
 */
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params

    const category = await Category.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'products',
          where: { isActive: true },
          required: false,
          attributes: { exclude: ['customizationOptions'] },
        },
      ],
    })

    if (!category) {
      throw errorResponse('Category not found', 404)
    }

    if (!category.isActive) {
      throw errorResponse('Category is not available', 404)
    }

    return successResponse(res, { category }, 'Category retrieved successfully')
  } catch (error) {
    next(error)
  }
}

/**
 * Get category by slug with products
 * GET /api/categories/slug/:slug
 */
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const { page = 1, limit = 12 } = req.query

    const category = await Category.findOne({
      where: { slug, isActive: true },
    })

    if (!category) {
      throw errorResponse('Category not found', 404)
    }

    // Get products with pagination
    const offset = (parseInt(page) - 1) * parseInt(limit)

    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        categoryId: category.id,
        isActive: true,
      },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['customizationOptions'] },
    })

    const totalPages = Math.ceil(count / parseInt(limit))

    return successResponse(
      res,
      {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
        },
        products,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
        },
      },
      'Category and products retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
}
