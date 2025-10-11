module.exports = (io, socket) => {
  socket.on('chat:join', async data => {
    console.log(socket.id, 'joined chat:', data.chatId)
    socket.join(data.chatId)
  })
  socket.on('chat:leave', async data => {
    console.log(socket.id, 'left chat:', data.chatId)
    socket.leave(data.chatId)
  })
}
