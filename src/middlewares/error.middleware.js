const logger = require('../config/logger')
const { HTTP_STATUS } = require('../constants')

/**
 * Global error handling middleware
 */
module.exports = (err, req, res, next) => {
  // Log error with context
  logger.error('Error occurred:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    requestId: req.id,
  })

  // Operational errors (expected errors we throw)
  if (err.operational) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: err.name || 'ERROR',
        message: err.message,
        ...(err.errors && { details: err.errors })
      },
      timestamp: err.timestamp || new Date().toISOString(),
      requestId: req.id,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
  }

  // Programming or unknown errors (don't leak error details in production)
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message
    },
    timestamp: new Date().toISOString(),
    requestId: req.id,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  })
}