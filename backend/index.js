require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
// Import database models
const db = require('./models')
const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// API Routes (to be added)
app.get('/api', (req, res) => {
  res.json({
    message: 'MakeBelieve Imprints API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      products: '/api/products/*',
      orders: '/api/orders/*',
      users: '/api/users/*',
    },
  })
})

// Import routes
const authRoutes = require('./routes/auth.routes')
const productRoutes = require('./routes/product.routes')
const categoryRoutes = require('./routes/category.routes')
const shippingRoutes = require('./routes/shipping.routes')
const orderRoutes = require('./routes/order.routes')
const checkoutRoutes = require('./routes/checkout.routes')
// const userRoutes = require('./routes/user.routes');

// Use routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/shipping', shippingRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/checkout', checkoutRoutes)
// app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// Start server after database initialization
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate()
    console.log('✓ Database connection established successfully.')

    // Sync database in development mode
    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: true })
      console.log('✓ Database synced successfully')
    }

    // Start listening
    app.listen(PORT, () => {
      console.log(`
  ╔════════════════════════════════════════════════╗
  ║   MakeBelieve Imprints API Server Started     ║
  ╠════════════════════════════════════════════════╣
  ║   Environment: ${
    process.env.NODE_ENV || 'development'
  }                      ║
  ║   Port: ${PORT}                                   ║
  ║   URL: http://localhost:${PORT}                  ║
  ║   Health: http://localhost:${PORT}/health        ║
  ╚════════════════════════════════════════════════╝
      `)
    })
  } catch (error) {
    console.error('✗ Failed to start server:', error.message)
    process.exit(1)
  }
}

// Start the server
startServer()

module.exports = app
