const { jwt } = require('../../utils')
const logger = require('../../config/logger')

/**
 * Socket.io authentication middleware
 * Verifies JWT token from socket handshake and attaches userId to socket
 */
const authenticate = (socket, next) => {
  try {
    const { token } = socket.handshake.auth

    if (!token) {
      logger.warn('Socket connection attempt without token', {
        socketId: socket.id,
        address: socket.handshake.address,
      })
      return next(new Error('Authentication token is missing'))
    }

    const payload = jwt.verifyToken(token, process.env.JWT_SECRET)
    socket.userId = payload.id

    logger.debug('Socket authenticated', {
      socketId: socket.id,
      userId: payload.id,
    })

    next()
  } catch (err) {
    logger.warn('Socket authentication failed', {
      socketId: socket.id,
      error: err.message,
    })
    next(new Error(err.message))
  }
}

module.exports = { authenticate }