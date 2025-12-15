const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')

// Public routes (none for orders - all require authentication)

// Authenticated user routes
router.post('/', authenticate, orderController.createOrder)
router.get('/', authenticate, orderController.getUserOrders)
router.get('/:id', authenticate, orderController.getOrderById)
router.post('/:id/cancel', authenticate, orderController.cancelOrder)

// Admin only routes
router.get(
  '/admin/all',
  authenticate,
  authorize('admin'),
  orderController.getAllOrders
)
router.get(
  '/admin/stats',
  authenticate,
  authorize('admin'),
  orderController.getOrderStats
)
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  orderController.updateOrderStatus
)

module.exports = router
