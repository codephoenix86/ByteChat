const { validationResult } = require('express-validator')
const { errors } = require('../utils')

/**
 * Validate request based on express-validator rules
 */
module.exports = (req, res, next) => {
  const errorList = validationResult(req)

  if (!errorList.isEmpty()) {
    const formattedErrors = errorList.array().map(err => ({
      message: err.msg,
      field: err.path,
      location: err.location,
    }))

    throw new errors.ValidationError('Validation failed', formattedErrors)
  }

  next()
}