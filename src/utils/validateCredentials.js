const { User } = require('../models')
const { AuthError } = require('../utils/errors')
const bcrypt = require('bcrypt')
const validateCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password')
  if (!user) throw new AuthError('invalid credentials')
  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new AuthError('invalid credentials')
  return user
}
module.exports = validateCredentials
