const { Message, Chat } = require('../models')
const { NotFoundError } = require('../utils/errors')
const ApiResponse = require('../utils/response')
const { socketSetup } = require('../sockets')

exports.sendMessage = async (req, res, next) => {
  const { content } = req.body
  const message = await Message.create({
    content,
    sender: req.user.id,
    chat: req.params.chatId,
  })
  const io = socketSetup.get()
  io.to(req.params.chatId).emit('message:new', {
    content,
    sender: req.user.id,
    chatId: req.params.chatId,
    id: message._id,
  })
  res
    .status(201)
    .json(new ApiResponse('message sent successfully', { message }))
}
exports.getMessages = async (req, res, next) => {
  const messages = await await Message.find({ chat: req.params.chatId })
    .populate('sender', 'username avatar -_id')
    .select('content createdAt sender -_id')
    .sort({ createdAt: 1 })
  if (messages.length === 0) throw new NotFoundError('no messages found')
  res
    .status(200)
    .json(new ApiResponse('messages fetched successfully', { messages }))
}
