const { verifyAccessToken } = require('../utils/jwt')
const { errorResponse } = require('../utils/helpers')

/**
 * Authenticate user by verifying JWT token
 * Attaches user data to req.user
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw errorResponse('No authentication token provided', 401)
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token)

    // Attach user data to request
    req.user = decoded

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Authorize user based on role
 * @param {string[]} allowedRoles - Array of allowed roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw errorResponse('Authentication required', 401)
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw errorResponse('Insufficient permissions', 403)
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

/**
 * Optional authentication - doesn't fail if no token
 * Useful for endpoints that work with or without authentication
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = verifyAccessToken(token)
      req.user = decoded
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
}
