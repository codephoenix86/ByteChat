const { HTTP_STATUS } = require('../../constants')

/**
 * Base application error class
 */
class AppError extends Error {
  constructor(message, status, operational = true) {
    super(message)
    this.status = status
    this.timestamp = new Date().toISOString()
    this.operational = operational
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Validation error (400)
 */
class ValidationError extends AppError {
  constructor(message, errors = undefined, status = HTTP_STATUS.BAD_REQUEST) {
    super(message, status)
    this.name = 'VALIDATION_ERROR'
    this.errors = errors
  }
}

/**
 * Authentication error (401)
 */
class AuthError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS.UNAUTHORIZED)
    this.name = 'AUTHENTICATION_ERROR'
  }
}

/**
 * Not found error (404)
 */
class NotFoundError extends AppError {
  constructor(message, status = HTTP_STATUS.NOT_FOUND) {
    super(message, status)
    this.name = 'NOT_FOUND'
  }
}

/**
 * Authorization error (403)
 */
class AuthorizationError extends AppError {
  constructor(message, status = HTTP_STATUS.FORBIDDEN) {
    super(message, status)
    this.name = 'FORBIDDEN'
  }
}

/**
 * Conflict error (409)
 */
class ConflictError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS.CONFLICT)
    this.name = 'CONFLICT'
  }
}

/**
 * Rate limit error (429)
 */
class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS)
    this.name = 'RATE_LIMIT_EXCEEDED'
  }
}

/**
 * Payload too large error (413)
 */
class PayloadTooLargeError extends AppError {
  constructor(message = 'File too large') {
    super(message, HTTP_STATUS.PAYLOAD_TOO_LARGE)
    this.name = 'PAYLOAD_TOO_LARGE'
  }
}


module.exports = {
  AppError,
  ValidationError,
  AuthError,
  NotFoundError,
  AuthorizationError,
  ConflictError,       
  RateLimitError,       
  PayloadTooLargeError, 
}