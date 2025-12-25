const EVENTS = require('../events')
const logger = require('../../config/logger')

/**
 * Handle chat room events (join/leave)
 * @param {Object} io - Socket.io server instance
 * @param {Object} socket - Socket instance
 */
module.exports = (io, socket) => {
  /**
   * User joins a chat room
   */
  socket.on(EVENTS.CHAT_JOIN, async data => {
    const { chatId } = data

    socket.join(chatId)

    logger.info('User joined chat', {
      socketId: socket.id,
      userId: socket.userId,
      chatId,
    })
  })

  /**
   * User leaves a chat room
   */
  socket.on(EVENTS.CHAT_LEAVE, async data => {
    const { chatId } = data

    socket.leave(chatId)

    logger.info('User left chat', {
      socketId: socket.id,
      userId: socket.userId,
      chatId,
    })
  })
}