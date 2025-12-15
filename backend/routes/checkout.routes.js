const express = require('express')
const router = express.Router()
const { calculateTaxRate, calculateTax } = require('../services/tax.service')
const {
  validateAddress,
  normalizeAddress,
} = require('../services/address-validation.service')

/**
 * @route   POST /api/checkout/calculate-tax
 * @desc    Calculate tax for an order
 * @access  Public
 */
router.post('/calculate-tax', async (req, res) => {
  try {
    const { subtotal, shippingAddress } = req.body

    // Validate required fields
    if (!subtotal || subtotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid subtotal is required',
      })
    }

    if (!shippingAddress || !shippingAddress.country) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address with country is required',
      })
    }

    // Calculate tax
    const taxCalculation = calculateTax(subtotal, shippingAddress)

    res.json({
      success: true,
      data: taxCalculation,
    })
  } catch (error) {
    console.error('Tax calculation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to calculate tax',
      error: error.message,
    })
  }
})

/**
 * @route   POST /api/checkout/tax-rate
 * @desc    Get tax rate for an address
 * @access  Public
 */
router.post('/tax-rate', async (req, res) => {
  try {
    const { shippingAddress } = req.body

    if (!shippingAddress || !shippingAddress.country) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address with country is required',
      })
    }

    // Get tax rate
    const taxRate = calculateTaxRate(shippingAddress)

    res.json({
      success: true,
      data: taxRate,
    })
  } catch (error) {
    console.error('Tax rate calculation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get tax rate',
      error: error.message,
    })
  }
})

/**
 * @route   POST /api/checkout/validate-address
 * @desc    Validate shipping address format
 * @access  Public
 */
router.post('/validate-address', async (req, res) => {
  try {
    const { address } = req.body

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required',
      })
    }

    // Normalize address
    const normalized = normalizeAddress(address)

    // Validate address
    const validation = validateAddress(normalized)

    res.json({
      success: validation.valid,
      data: {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
        normalized: normalized,
      },
    })
  } catch (error) {
    console.error('Address validation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to validate address',
      error: error.message,
    })
  }
})

module.exports = router
