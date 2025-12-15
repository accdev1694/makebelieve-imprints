const express = require('express')
const { body } = require('express-validator')
const {
  register,
  login,
  refreshAccessToken,
  getProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require('../controllers/auth.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')

const router = express.Router()

/**
 * Validation middleware
 */
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  validate,
]

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
]

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  validate,
]

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
]

const verifyEmailValidation = [
  body('token').notEmpty().withMessage('Verification token is required'),
  validate,
]

/**
 * Public routes
 */
router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)
router.post('/refresh', refreshAccessToken)
router.post('/forgot-password', forgotPasswordValidation, forgotPassword)
router.post('/reset-password', resetPasswordValidation, resetPassword)
router.post('/verify-email', verifyEmailValidation, verifyEmail)

/**
 * Protected routes
 */
router.get('/profile', authenticate, getProfile)

module.exports = router
