const { User } = require('../models')
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateRandomToken,
} = require('../utils/jwt')
const {
  successResponse,
  errorResponse,
  hashToken,
} = require('../utils/helpers')

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body

    // Validation
    if (!email || !password || !firstName || !lastName) {
      throw errorResponse('All fields are required', 400)
    }

    if (password.length < 6) {
      throw errorResponse('Password must be at least 6 characters', 400)
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      throw errorResponse('Email already registered', 400)
    }

    // Generate email verification token
    const emailVerificationToken = generateRandomToken()

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      emailVerificationToken: hashToken(emailVerificationToken),
    })

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email, user.role)
    const refreshToken = generateRefreshToken(user.id)

    // TODO: Send verification email with emailVerificationToken
    console.log('Verification token:', emailVerificationToken)

    return successResponse(
      res,
      {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
      'Registration successful',
      201
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      throw errorResponse('Email and password are required', 400)
    }

    // Find user
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw errorResponse('Invalid email or password', 401)
    }

    // Check if user is active
    if (!user.isActive) {
      throw errorResponse('Account is deactivated', 403)
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw errorResponse('Invalid email or password', 401)
    }

    // Update last login
    await user.update({ lastLogin: new Date() })

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email, user.role)
    const refreshToken = generateRefreshToken(user.id)

    return successResponse(
      res,
      {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
      'Login successful'
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      throw errorResponse('Refresh token is required', 400)
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken)

    // Find user
    const user = await User.findByPk(decoded.userId)
    if (!user || !user.isActive) {
      throw errorResponse('User not found or inactive', 404)
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.email, user.role)

    return successResponse(
      res,
      {
        accessToken: newAccessToken,
      },
      'Token refreshed successfully'
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get current user profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res, next) => {
  try {
    // User is attached by auth middleware
    const user = await User.findByPk(req.user.userId)

    if (!user) {
      throw errorResponse('User not found', 404)
    }

    return successResponse(res, { user: user.toJSON() }, 'Profile retrieved')
  } catch (error) {
    next(error)
  }
}

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      throw errorResponse('Email is required', 400)
    }

    // Find user
    const user = await User.findOne({ where: { email } })
    if (!user) {
      // Don't reveal if email exists
      return successResponse(
        res,
        {},
        'If the email exists, a reset link will be sent'
      )
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = generateRandomToken()
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save hashed token to database
    await user.update({
      passwordResetToken: hashToken(resetToken),
      passwordResetExpires: resetTokenExpiry,
    })

    // TODO: Send password reset email with resetToken
    console.log('Password reset token:', resetToken)

    return successResponse(
      res,
      {},
      'If the email exists, a reset link will be sent'
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      throw errorResponse('Token and new password are required', 400)
    }

    if (newPassword.length < 6) {
      throw errorResponse('Password must be at least 6 characters', 400)
    }

    // Find user with valid reset token
    const hashedToken = hashToken(token)
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [require('sequelize').Op.gt]: new Date() },
      },
    })

    if (!user) {
      throw errorResponse('Invalid or expired reset token', 400)
    }

    // Update password and clear reset token
    await user.update({
      password: newPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    })

    return successResponse(res, {}, 'Password reset successful')
  } catch (error) {
    next(error)
  }
}

/**
 * Verify email
 * POST /api/auth/verify-email
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body

    if (!token) {
      throw errorResponse('Verification token is required', 400)
    }

    // Find user with verification token
    const hashedToken = hashToken(token)
    const user = await User.findOne({
      where: { emailVerificationToken: hashedToken },
    })

    if (!user) {
      throw errorResponse('Invalid verification token', 400)
    }

    // Mark email as verified
    await user.update({
      isEmailVerified: true,
      emailVerificationToken: null,
    })

    return successResponse(res, {}, 'Email verified successfully')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  refreshAccessToken,
  getProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
}
