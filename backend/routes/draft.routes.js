const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/auth.middleware')

// In-memory storage for draft orders (use Redis or DB in production)
const draftOrders = new Map()

/**
 * @route   POST /api/checkout/draft
 * @desc    Save draft order (incomplete checkout)
 * @access  Private
 */
router.post('/draft', authenticate, async (req, res) => {
  try {
    const userId = req.user.id
    const { step, formData, cartItems, selectedShipping } = req.body

    if (!step || !formData) {
      return res.status(400).json({
        success: false,
        message: 'Step and form data are required',
      })
    }

    // Create draft order object
    const draftOrder = {
      userId,
      step,
      formData,
      cartItems: cartItems || [],
      selectedShipping: selectedShipping || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save draft (in production, save to database)
    draftOrders.set(userId, draftOrder)

    res.json({
      success: true,
      message: 'Draft order saved successfully',
      data: {
        step,
        savedAt: draftOrder.updatedAt,
      },
    })
  } catch (error) {
    console.error('Draft order save error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save draft order',
      error: error.message,
    })
  }
})

/**
 * @route   GET /api/checkout/draft
 * @desc    Get saved draft order
 * @access  Private
 */
router.get('/draft', authenticate, async (req, res) => {
  try {
    const userId = req.user.id

    // Get draft from storage
    const draftOrder = draftOrders.get(userId)

    if (!draftOrder) {
      return res.json({
        success: true,
        data: null,
        message: 'No draft order found',
      })
    }

    res.json({
      success: true,
      data: draftOrder,
    })
  } catch (error) {
    console.error('Draft order retrieval error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve draft order',
      error: error.message,
    })
  }
})

/**
 * @route   DELETE /api/checkout/draft
 * @desc    Delete saved draft order
 * @access  Private
 */
router.delete('/draft', authenticate, async (req, res) => {
  try {
    const userId = req.user.id

    // Delete draft
    const existed = draftOrders.delete(userId)

    res.json({
      success: true,
      message: existed
        ? 'Draft order deleted successfully'
        : 'No draft order found',
    })
  } catch (error) {
    console.error('Draft order deletion error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete draft order',
      error: error.message,
    })
  }
})

module.exports = router
