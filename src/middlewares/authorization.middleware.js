const { errors } = require('../utils')

/**
 * Role-based authorization middleware
 * @param {String} role - Required role
 */
exports.role = role => (req, res, next) => {
  if (req.user.role !== role) {
    throw new errors.AuthorizationError('You are not authorized to perform this action')
  }
  next()
}