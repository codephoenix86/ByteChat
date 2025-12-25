const { User } = require('../models')

class UserRepository {
  async create(userData) {
    return await User.create(userData)
  }

  async findById(userId) {
    return await User.findById(userId)
  }

  async findByIdWithPassword(userId) {
    return await User.findById(userId).select('+password')
  }

  async findOne(query) {
    return await User.findOne(query)
  }

  async findOneWithPassword(query) {
    return await User.findOne(query).select('+password')
  }

  async findAll(query, options = {}) {
    const { skip = 0, limit = 20, sort = { createdAt: -1 } } = options
    return await User.find(query).sort(sort).skip(skip).limit(limit).select('-password')
  }

  async countDocuments(query) {
    return await User.countDocuments(query)
  }

  async findByIdAndUpdate(userId, updateData, options = {}) {
    return await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true, ...options })
  }

  async findByIdAndDelete(userId) {
    return await User.findByIdAndDelete(userId)
  }

  async exists(query) {
    return await User.exists(query)
  }
}

module.exports = new UserRepository()