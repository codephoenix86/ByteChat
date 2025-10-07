const jwt = require('jsonwebtoken')
const {
  jwt: { access, refresh },
} = require('../config/env')
const { AuthError, ValidationError, AppError } = require('../utils/errors')

const verify = (token, secret) => {
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'SyntaxError')
      throw new AuthError('invalid token')
    if (err.name === 'TokenExpiredError') throw new AuthError('token expired')
    if (err.name === 'NotBeforeError') throw new AuthError('token is not active yet')
    throw new AuthError('authentication failed')
  }
}

exports.accessToken = strict => (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]
  try {
    if (!token) throw new ValidationError('authorization token missing or malformed')
    const payload = verify(token, access.secret)
    req.user = payload
  } catch (err) {
    if (strict) throw err
  }
  next()
}
exports.refreshToken = (req, res, next) => {
  const { refreshToken } = req.body
  const payload = verify(refreshToken, refresh.secret)
  req.user = payload
  next()
}

exports.token = method => (req, res, next) => {
  let token
  if (method.type === 'header') {
    const authHeader = req.headers[method.field]
    token = authHeader?.split(' ')[1]
  }
  if (method.type === 'body') {
    token = req.body[method.field]
  }
  if (!token) throw new ValidationError('authorization token missing or malformed')
  const payload = verify(token, access.secret)
  req.user = payload
  next()
}
