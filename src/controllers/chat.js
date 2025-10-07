const { Chat } = require('../models')
const ApiResponse = require('../utils/response')
const { NotFoundError } = require('../utils/errors')
exports.createChat = async (req, res, next) => {
  const { participants } = req.body
  const chat = await Chat.create({
    admin: req.user.id,
    participants: [req.user.id, ...participants],
  })
  res.status(201).json(new ApiResponse('chat created successfully', { chat }))
}
exports.getChats = async (req, res, next) => {
  const chats = await Chat.find({ participants: req.user.id }).populate('participants', 'username avatar -_id')
  if (!chats) throw new NotFoundError('no chats found')
  res.status(200).json(new ApiResponse('chats fetched successfully', { chats }))
}
