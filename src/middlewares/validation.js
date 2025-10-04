const { body, validationResult } = require('express-validator')
const { ValidationError } = require('../utils/errors')

exports.fields =
  (...arr) =>
  async (req, res, next) => {
    const rules = arr.map(item => body(item).exists().withMessage(`${item} is required`))
    await Promise.all(rules.map(rule => rule.run(req)))
    const errors = validationResult(req)
    if (!errors.isEmpty())
      throw new ValidationError(
        'missing required fields',
        errors.array().map(err => ({ message: err.msg, field: err.path }))
      )
    next()
  }

exports.signup = async (req, res, next) => {
  const rules = [
    body('username').exists().withMessage('username is required'),
    body('password').exists().withMessage('password is required'),
  ]
  await Promise.all(rules.map(rule => rule.run(req)))
  const errors = validationResult(req)
  if (!errors.isEmpty())
    throw new ValidationError(
      'missing required fields',
      errors.array().map(err => ({ message: err.msg, field: err.path }))
    )
  next()
}

exports.login = async (req, res, next) => {
  const rules = [
    body('username').exists().withMessage('username is required'),
    body('password').exists().withMessage('password is required'),
  ]
  await Promise.all(rules.map(rule => rule.run(req)))
  const errors = validationResult(req)
  if (!errors.isEmpty())
    throw new ValidationError(
      'missing required fields',
      errors.array().map(err => ({ message: err.msg, field: err.path }))
    )
  next()
}
exports.refreshToken = async (req, res, next) => {
  const rules = [body('refreshToken').exists().withMessage('refresh token is missing')]
  await Promise.all(rules.map(rule => rule.run(req)))
  const errors = validationResult(req)
  if (!errors.isEmpty())
    throw new ValidationError(
      'missing required fields',
      errors.array().map(err => ({ message: err.msg, field: err.path }))
    )
  next()
}
exports.token = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]
  if (!token) throw new ValidationError('authorization token missing or malformed')
  next()
}
