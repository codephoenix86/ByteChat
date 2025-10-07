module.exports = (io, socket) => {
  socket.on('join-chat', async data => {
    console.log(socket.id, 'joined chat:', data.chatId)
    socket.join(data.chatId)
  })
  socket.on('leave-chat', async data => {
    console.log(socket.id, 'left chat:', data.chatId)
    socket.leave(data.chatId)
  })
}
