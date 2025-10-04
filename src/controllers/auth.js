const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User, RefreshToken } = require('../models')
const { AuthError } = require('../utils/errors')
const ApiResponse = require('../utils/response')
const {
  jwt: { access, refresh },
} = require('../config/env')

exports.signup = async (req, res, next) => {
  const { username, password } = req.body
  const user = await User.create({ username, password })
  res.status(201).json(new ApiResponse('user created successfully', { user }, 201))
}
exports.login = async (req, res, next) => {
  const { username, password } = req.body
  const user = await User.findOne({ username }).select('+password')
  if (!user) throw new AuthError('invalid credentials')
  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new AuthError('invalid credentials')
  console.log(access)
  const accessToken = jwt.sign({ id: user._id, username }, access.secret, {
    expiresIn: access.exp,
  })
  const refreshToken = jwt.sign({ id: user._id, username }, refresh.secret, {
    expiresIn: refresh.exp,
  })
  await RefreshToken.create({ user: user._id, refreshToken })
  res.status(200).json(
    new ApiResponse('user logged in successfully', {
      user,
      accessToken,
      refreshToken,
    })
  )
}
exports.logout = async (req, res, next) => {
  const { refreshToken } = req.body
  const { id } = req.user
  const token = await RefreshToken.findOne({ user: id, refreshToken })
  if (!token) throw new AuthError('invalid token')
  await RefreshToken.deleteOne({ user: id, refreshToken })
  res.status(200).json(new ApiResponse('user logged out successfully'))
}
exports.refreshToken = async (req, res, next) => {
  console.log(req.user)
  const { refreshToken } = req.body
  const { id, username } = req.user
  const token = await RefreshToken.findOne({ refreshToken, user: id })
  if (!token) throw new AuthError('invalid refresh token')

  const newAccessToken = jwt.sign({ id, username }, access.secret, {
    expiresIn: access.exp,
  })
  const newRefreshToken = jwt.sign({ id, username }, refresh.secret, {
    expiresIn: refresh.exp,
  })
  await RefreshToken.updateOne({ refreshToken, user: id }, { refreshToken: newRefreshToken })
  res.status(200).json(
    new ApiResponse('token generated successfully', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  )
}
