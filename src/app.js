require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const addRequestId = (req, res, next) => {
  req.id = crypto.randomUUID()
  next()
}

const app = express()
const routes = require('./routes')
const { errorHandler, sanitize } = require('./middlewares')
const logger = require('./config/logger')

// Security middleware
app.use(helmet())

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))

// Request parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Add request ID to all requests
app.use(addRequestId)

// Sanitize user input
app.use(sanitize)

// Request logging middleware
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    requestId: req.id,
  })
  next()
})

// Static files
app.use('/uploads', express.static('uploads/public'))

// API routes
app.use('/api', routes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    status: 404,
    timestamp: new Date().toISOString(),
  })
})

// Global error handler (must be last)
app.use(errorHandler)

module.exports = app