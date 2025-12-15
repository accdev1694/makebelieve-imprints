const crypto = require('crypto')

/**
 * Generate a secure random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Hash a token (for storing in database)
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Format error response
 */
const errorResponse = (message, statusCode = 400) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

/**
 * Format success response
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `ORD-${timestamp}-${random}`
}

/**
 * Slugify text (for product/category URLs)
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

module.exports = {
  generateToken,
  hashToken,
  errorResponse,
  successResponse,
  isValidEmail,
  generateOrderNumber,
  slugify,
}
