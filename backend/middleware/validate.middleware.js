const { validationResult } = require('express-validator')
const { errorResponse } = require('../utils/helpers')

/**
 * Validation middleware
 * Checks express-validator results and returns errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }))

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    })
  }

  next()
}

module.exports = { validate }
