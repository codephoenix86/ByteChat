const { Message } = require('../models')
module.exports = (io, socket) => {
  socket.on('message:delivered', async data => {
    console.log('message delivered to user:', data.userId)
    await Message.findByIdAndUpdate(data.messageId, { status: 'delivered' })
  })
  socket.on('message:read', async data => {
    console.log(data.userId, 'read the message')
    await Message.findByIdAndUpdate(data.messageId, { status: 'read' })
  })
  socket.on('message:start-typing', data => {
    console.log(socket.userId, 'is typing')
    io.to(data.chatId).emit('message:start-typing', { userId: socket.userId })
  })
  socket.on('message:stop-typing', data => {
    console.log(socket.userId, 'has stopped typing')
    io.to(data.chatId).emit('message:stop-typing', { userId: socket.userId })
  })
}
