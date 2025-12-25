const { errors, jwt } = require('../utils')
const { refreshTokenRepository } = require('../repositories')

/**
 * Verify access token middleware
 */
exports.accessToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) {
    throw new errors.ValidationError('Authorization token missing or malformed')
  }

  const payload = jwt.verifyToken(token, process.env.JWT_SECRET)
  req.user = payload
  next()
}

/**
 * Verify refresh token middleware
 */
exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    throw new errors.ValidationError('Refresh token is required')
  }

  const user = jwt.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)

  const tokenDoc = await refreshTokenRepository.exists({
    user: user.id,
    refreshToken,
  })

  if (!tokenDoc) {
    throw new errors.AuthError('Invalid refresh token')
  }

  req.user = user
  next()
}