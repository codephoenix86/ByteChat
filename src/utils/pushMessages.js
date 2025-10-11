const { Message, Chat } = require('../models')
module.exports = async (socket, userId) => {
  let chats = await Chat.find({ participants: userId })
  chats = chats.map(chat => chat._id)
  const messages = await Message.find({ status: 'sent', chat: { $in: chats } })
  messages.forEach(message =>
    socket.emit('message:new', {
      id: message._id,
      content: message.content,
      sender: message.sender,
      chatId: message.chat,
    })
  )
}
