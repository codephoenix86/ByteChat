const { Server } = require('socket.io')
const { addSocket, removeSocket, onlineUsers } = require('./users')
const { User } = require('../models')
const chats = require('./chat')
const messages = require('./message')
const pushMessages = require('../utils/pushMessages')

const {
  sockets: { authentication },
} = require('../middlewares')
let io = undefined
exports.init = server => {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  })
  io.use(authentication)
  io.on('connection', async socket => {
    console.log('new socket connected:', socket.id)
    const userId = socket.userId
    chats(io, socket)
    messages(io, socket)
    addSocket(userId, socket.id)
    if (onlineUsers[userId].size == 1)
    {
      socket.broadcast.emit('user:online', { userId })
      pushMessages(socket, userId)
    }
    socket.on('disconnect', async reason => {
      console.log('socket disconnected:', socket.id)
      removeSocket(userId, socket.id)
      if (!onlineUsers[userId]) {
        await User.findByIdAndUpdate(userId, { lastSeen: Date.now() })
        socket.broadcast.emit('user:offline', { userId })
      }
    })
  })
  return io
}
exports.get = () => {
  return io
}
