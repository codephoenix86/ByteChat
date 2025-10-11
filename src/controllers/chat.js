const { Chat, User } = require('../models')
const mongoose = require('mongoose')
const ApiResponse = require('../utils/response')
const {
  NotFoundError,
  ValidationError,
  AuthorizationError,
} = require('../utils/errors')

exports.createChat = async (req, res, next) => {
  const { participants, type } = req.body
  participants.push(req.user.id)
  const admin = type === 'group' ? req.user.id : undefined
  const groupName = type === 'group' ? req.body.groupName : undefined
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const count = await User.countDocuments({
      _id: { $in: participants },
    }).session(session)
    if (count !== participants.length)
      throw new ValidationError(
        'there is at least one user that does not exists'
      )
    const [chat] = await Chat.create(
      [
        {
          type,
          groupName,
          admin,
          participants,
        },
      ],
      { session }
    )
    await session.commitTransaction()
    res.status(201).json(
      new ApiResponse('chat created successfully', {
        type,
        groupName,
        admin,
        participants,
      })
    )
  } catch (err) {
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }
}

exports.getChats = async (req, res, next) => {
  const chats = await Chat.find({ participants: req.user.id })
    .populate('participants', 'username avatar -_id')
    .select('-__v')
  if (chats.length == 0) throw new NotFoundError('no chats found')
  res.status(200).json(new ApiResponse('chats fetched successfully', { chats }))
}

exports.joinGroup = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const chat = await Chat.findById(req.params.chatId, null, { session })
    if (!chat) throw new ValidationError('group does not exist')
    if (chat.type === 'private')
      throw new ValidationError('cannot join a private chat')
    if (chat.participants.includes(req.user.id))
      throw new ValidationError('user already exists in group')
    await Chat.findByIdAndUpdate(
      req.params.chatId,
      {
        $addToSet: { participants: req.user.id },
      },
      { session }
    )
    await session.commitTransaction()
    session.endSession()
    res.status(200).json(new ApiResponse('user joined the group successfully'))
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}

exports.leaveGroup = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const chat = await Chat.findById(req.params.chatId, null, { session })
    if (!chat) throw new ValidationError('chat does not exist')
    if (chat.type === 'private')
      throw new ValidationError('cannot leave a private chat')
    if (!chat.participants.includes(req.user.id))
      throw new ValidationError('you do not belong to this group')
    if (chat.admin.toString() === req.user.id && chat.participants.length > 1)
      throw new AuthorizationError(
        'admin cannot leave without transferring ownership'
      )
    await Chat.findByIdAndUpdate(
      req.params.chatId,
      {
        $pull: { participants: req.user.id },
      },
      { session }
    )
    if (chat.participants.length === 1)
      await Chat.findByIdAndDelete(req.params.chatId, { session })
    await session.commitTransaction()
    session.endSession()
    res.status(200).json(new ApiResponse('user left the group successfully'))
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}

exports.makeAdmin = async (req, res, next) => {
  const chat = await Chat.findById(req.params.chatId)
  if (!chat) throw new ValidationError('group does not exist')
  if (chat.type === 'private')
    throw new ValidationError('private chat cannot have admin')
  if (chat.admin.toString() !== req.user.id)
    throw new AuthorizationError('you are not an admin of group')
  await Chat.findByIdAndUpdate(req.params.chatId, { admin: req.body.newAdmin })
  res.status(200).json(new ApiResponse('admin changed successfully'))
}
