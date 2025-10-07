class AppError extends Error {
  constructor(message, status, op = true) {
    super(message)
    this.status = status
    this.timestamp = new Date().toISOString()
    this.operational = op
    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends AppError {
  constructor(message, errors = undefined, status = 400) {
    super(message, status)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

class AuthError extends AppError {
  constructor(message) {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

class NotFoundError extends AppError {
  constructor(message, status = 404) {
    super(message, status)
    this.name = 'NotFoundError'
  }
}

class AuthorizationError extends AppError {
  constructor(message, status = 403) {
    super(message, status)
    this.name = 'AuthorizationError'
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthError,
  NotFoundError,
  AuthorizationError,
}
