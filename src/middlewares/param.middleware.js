const { errors } = require('../utils')
const mongoose = require('mongoose')

/**
 * Validate MongoDB ObjectId parameter
 * @param {String} name - Parameter name for error message
 */
exports.validateId = name => (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new errors.ValidationError(`Invalid ${name} ID`)
  }
  next()
}