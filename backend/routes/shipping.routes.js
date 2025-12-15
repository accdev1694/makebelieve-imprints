const express = require('express')
const router = express.Router()
const royalMailService = require('../services/royalmail.service')
const { Order, OrderItem, Product } = require('../models')

/**
 * GET /api/shipping/rates
 * Calculate shipping rates based on cart contents and destination
 */
router.post('/rates', async (req, res) => {
  try {
    const { items, destination } = req.body

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'No items provided',
      })
    }

    if (!destination || !destination.country) {
      return res.status(400).json({
        success: false,
        message: 'Destination country is required',
      })
    }

    // Calculate total weight and find largest dimensions
    let totalWeight = 0
    let maxDimensions = { length: 0, width: 0, height: 0 }

    for (const item of items) {
      const product = await Product.findByPk(item.productId)

      if (!product) {
        continue
      }

      const itemWeight = product.weight || 100 // Default 100g if not specified
      totalWeight += itemWeight * item.quantity

      // Track largest dimensions
      if (product.dimensions) {
        maxDimensions.length = Math.max(
          maxDimensions.length,
          product.dimensions.length || 0
        )
        maxDimensions.width = Math.max(
          maxDimensions.width,
          product.dimensions.width || 0
        )
        maxDimensions.height = Math.max(
          maxDimensions.height,
          product.dimensions.height || 0
        )
      }
    }

    // Default dimensions if none found
    if (maxDimensions.length === 0) {
      maxDimensions = { length: 20, width: 15, height: 5 }
    }

    // Get shipping rates from Royal Mail
    const rates = await royalMailService.getShippingRates({
      weight: totalWeight,
      dimensions: maxDimensions,
      fromPostcode: process.env.BUSINESS_POSTCODE || 'SW1A 1AA',
      toPostcode: destination.zipCode || destination.postcode,
      toCountry: destination.country,
    })

    res.json({
      success: true,
      data: rates,
    })
  } catch (error) {
    console.error('Shipping rates error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to calculate shipping rates',
      error: error.message,
    })
  }
})

/**
 * POST /api/shipping/create
 * Create a shipment and generate Royal Mail label
 */
router.post('/create', async (req, res) => {
  try {
    const { orderId, serviceCode } = req.body

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Prepare parcel data
    const parcels = [
      {
        weight: order.OrderItems.reduce((sum, item) => {
          const weight = item.Product.weight || 100
          return sum + weight * item.quantity
        }, 0),
        dimensions: {
          length: 20,
          width: 15,
          height: 5,
        },
        contents: order.OrderItems.map((item) => item.Product.name).join(', '),
      },
    ]

    // Prepare customs declaration for international orders
    let customsDeclaration = null
    if (order.shippingAddress.country !== 'GB') {
      customsDeclaration = {
        categoryType: 'MERCHANDISE',
        deliveryTerms: 'DDU', // Delivery Duty Unpaid
        items: order.OrderItems.map((item) => ({
          description: item.Product.name,
          quantity: item.quantity,
          value: parseFloat(item.price),
          weight: item.Product.weight || 100,
          tariffCode: item.Product.tariffCode || '4901100000', // Default for printed matter
        })),
      }
    }

    // Create shipment
    const shipment = await royalMailService.createShipment({
      orderId: order.id,
      serviceCode,
      recipientAddress: order.shippingAddress,
      senderAddress: {
        firstName: 'Makebelieve',
        lastName: 'Imprints',
        street: process.env.BUSINESS_ADDRESS_LINE1,
        street2: process.env.BUSINESS_ADDRESS_LINE2,
        city: process.env.BUSINESS_CITY,
        postcode: process.env.BUSINESS_POSTCODE,
        country: 'GB',
        phone: process.env.BUSINESS_PHONE,
      },
      parcels,
      customsDeclaration,
    })

    // Update order with tracking information
    await order.update({
      trackingNumber: shipment.trackingNumber,
      status: 'processing',
    })

    res.json({
      success: true,
      data: shipment,
    })
  } catch (error) {
    console.error('Shipment creation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create shipment',
      error: error.message,
    })
  }
})

/**
 * GET /api/shipping/track/:trackingNumber
 * Track a Royal Mail shipment
 */
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params

    const tracking = await royalMailService.trackShipment(trackingNumber)

    res.json({
      success: true,
      data: tracking,
    })
  } catch (error) {
    console.error('Tracking error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tracking information',
      error: error.message,
    })
  }
})

/**
 * GET /api/shipping/countries
 * Get list of countries Royal Mail ships to
 */
router.get('/countries', async (req, res) => {
  try {
    // Major countries Royal Mail ships to
    const countries = [
      { code: 'GB', name: 'United Kingdom', zone: 'UK' },
      { code: 'IE', name: 'Ireland', zone: 'Europe' },
      { code: 'FR', name: 'France', zone: 'Europe' },
      { code: 'DE', name: 'Germany', zone: 'Europe' },
      { code: 'ES', name: 'Spain', zone: 'Europe' },
      { code: 'IT', name: 'Italy', zone: 'Europe' },
      { code: 'NL', name: 'Netherlands', zone: 'Europe' },
      { code: 'BE', name: 'Belgium', zone: 'Europe' },
      { code: 'US', name: 'United States', zone: 'World Zone 1' },
      { code: 'CA', name: 'Canada', zone: 'World Zone 1' },
      { code: 'AU', name: 'Australia', zone: 'World Zone 2' },
      { code: 'NZ', name: 'New Zealand', zone: 'World Zone 2' },
      { code: 'JP', name: 'Japan', zone: 'World Zone 2' },
      { code: 'SG', name: 'Singapore', zone: 'World Zone 2' },
      { code: 'AE', name: 'United Arab Emirates', zone: 'World Zone 2' },
    ]

    res.json({
      success: true,
      data: countries,
    })
  } catch (error) {
    console.error('Countries list error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve countries list',
      error: error.message,
    })
  }
})

module.exports = router
