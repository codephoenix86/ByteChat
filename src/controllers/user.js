const { User } = require('../models')
const ApiResponse = require('../utils/response')
const { NotFoundError } = require('../utils/errors')

exports.getUsers = async (req, res, next) => {
  const users = await User.find()
  if (users.length == 0) throw new NotFoundError('users not found')
  res.status(200).json(new ApiResponse('fetched users successfully', users))
}
exports.getUserById = async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new NotFoundError('user not found')
  if (req.user?.role === 'admin')
    return res.status(200).json(new ApiResponse('user fetched successfully', user))
  return res.status(200).json(
    new ApiResponse('user fetched successfully', {
      username: user.username,
      avatar: user.avatar,
      lastSeen: user.lastSeen,
      bio: user.bio,
    })
  )
}
exports.getCurrentUser = async (req, res, next) => {
  const user = await User.findById(req.user.id)
  if (!user) throw new NotFoundError('user does not exist')
  res.status(200).json(new ApiResponse('current user details', { user }))
}
exports.updateCurrentUser = async (req, res, next) => {
  const { email, username, avatar, password } = req.body
  const user = await User.findById(req.user.id).select('+password')
  if (!user) throw new NotFoundError('user does not exists')
  await user.updateProfile({ email, username, avatar, password })
  res.status(200).json(new ApiResponse('user updated successfully', { user }))
}
