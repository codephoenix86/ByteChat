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
  constructor(message, errors = undefined) {
    super(message, 400)
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

module.exports = {
  AppError,
  ValidationError,
  AuthError,
}
