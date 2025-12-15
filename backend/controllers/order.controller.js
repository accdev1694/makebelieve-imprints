const { Order, OrderItem, Product, User } = require('../models')
const { Op } = require('sequelize')

/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-XXXXX
 */
const generateOrderNumber = async () => {
  const date = new Date()
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')

  // Find the last order of today
  const lastOrder = await Order.findOne({
    where: {
      orderNumber: {
        [Op.like]: `ORD-${dateStr}-%`,
      },
    },
    order: [['createdAt', 'DESC']],
  })

  let sequence = 1
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2])
    sequence = lastSequence + 1
  }

  return `ORD-${dateStr}-${sequence.toString().padStart(5, '0')}`
}

/**
 * Create a new order
 * POST /api/orders
 */
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      shippingMethod,
      shippingCost,
      tax,
      discount,
      customerNotes,
      currency = 'GBP',
    } = req.body

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      })
    }

    if (!shippingAddress || !billingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping and billing addresses are required',
      })
    }

    // Validate all products exist and are in stock
    const productIds = items.map((item) => item.productId)
    const products = await Product.findAll({
      where: { id: productIds, isActive: true },
    })

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more products not found or inactive',
      })
    }

    // Calculate subtotal and validate stock
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found`,
        })
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        })
      }

      const itemPrice = parseFloat(product.price)
      const itemSubtotal = itemPrice * item.quantity
      subtotal += itemSubtotal

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: itemPrice,
        subtotal: itemSubtotal,
        productSnapshot: {
          name: product.name,
          sku: product.sku,
          images: product.images,
          description: product.shortDescription || product.description,
        },
        customizationData: item.customizationData || null,
        designFileUrl: item.designFileUrl || null,
      })
    }

    // Calculate total
    const taxAmount = parseFloat(tax || 0)
    const shippingAmount = parseFloat(shippingCost || 0)
    const discountAmount = parseFloat(discount || 0)
    const total = subtotal + taxAmount + shippingAmount - discountAmount

    // Generate order number
    const orderNumber = await generateOrderNumber()

    // Create order with items in a transaction
    const order = await Order.create({
      userId: req.user?.id || null,
      orderNumber,
      status: 'pending',
      subtotal,
      tax: taxAmount,
      shippingCost: shippingAmount,
      discount: discountAmount,
      total,
      currency,
      paymentStatus: 'pending',
      shippingAddress,
      billingAddress,
      shippingMethod: shippingMethod || null,
      customerNotes: customerNotes || null,
    })

    // Create order items
    const createdItems = await Promise.all(
      orderItems.map((item) =>
        OrderItem.create({
          ...item,
          orderId: order.id,
        })
      )
    )

    // Update product stock
    await Promise.all(
      items.map((item) =>
        Product.decrement('stock', {
          by: item.quantity,
          where: { id: item.productId },
        })
      )
    )

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    })

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: completeOrder,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all orders for authenticated user
 * GET /api/orders
 */
exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const offset = (page - 1) * limit

    const whereClause = { userId: req.user.id }
    if (status) {
      whereClause.status = status
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    res.json({
      success: true,
      orders,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get order by ID
 * GET /api/orders/:id
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params

    const order = await Order.findOne({
      where: { id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
      ],
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Check if user owns this order (unless admin)
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    res.json({
      success: true,
      order,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update order status
 * PATCH /api/orders/:id/status
 * Admin only
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, trackingNumber, trackingUrl, adminNotes } = req.body

    const order = await Order.findByPk(id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    const updates = { status }

    if (trackingNumber) updates.trackingNumber = trackingNumber
    if (trackingUrl) updates.trackingUrl = trackingUrl
    if (adminNotes) updates.adminNotes = adminNotes

    // Set timestamps based on status
    if (status === 'shipped' && !order.shippedAt) {
      updates.shippedAt = new Date()
    } else if (status === 'delivered' && !order.deliveredAt) {
      updates.deliveredAt = new Date()
    } else if (status === 'cancelled' && !order.cancelledAt) {
      updates.cancelledAt = new Date()
    }

    await order.update(updates)

    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    })

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Cancel order
 * POST /api/orders/:id/cancel
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params
    const { cancellationReason } = req.body

    const order = await Order.findOne({
      where: { id },
      include: [{ model: OrderItem, as: 'items' }],
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Check if user owns this order (unless admin)
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    // Only allow cancellation of pending or processing orders
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Only pending or processing orders can be cancelled',
      })
    }

    // Restore product stock
    await Promise.all(
      order.items.map((item) =>
        Product.increment('stock', {
          by: item.quantity,
          where: { id: item.productId },
        })
      )
    )

    // Update order status
    await order.update({
      status: 'cancelled',
      cancelledAt: new Date(),
      cancellationReason: cancellationReason || 'Cancelled by user',
    })

    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    })

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: updatedOrder,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all orders (Admin only)
 * GET /api/orders/admin/all
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query
    const offset = (page - 1) * limit

    const whereClause = {}
    if (status) {
      whereClause.status = status
    }
    if (search) {
      whereClause.orderNumber = { [Op.like]: `%${search}%` }
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    res.json({
      success: true,
      orders,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get order statistics (Admin only)
 * GET /api/orders/admin/stats
 */
exports.getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.count()
    const pendingOrders = await Order.count({ where: { status: 'pending' } })
    const processingOrders = await Order.count({
      where: { status: 'processing' },
    })
    const shippedOrders = await Order.count({ where: { status: 'shipped' } })
    const deliveredOrders = await Order.count({
      where: { status: 'delivered' },
    })
    const cancelledOrders = await Order.count({
      where: { status: 'cancelled' },
    })

    // Calculate total revenue (only paid orders)
    const revenueResult = await Order.sum('total', {
      where: { paymentStatus: 'paid' },
    })

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: revenueResult || 0,
      },
    })
  } catch (error) {
    next(error)
  }
}
