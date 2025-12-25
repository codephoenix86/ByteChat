const { Message } = require('../models')

class MessageRepository {
  async create(messageData) {
    return await Message.create(messageData)
  }

  async findById(messageId) {
    return await Message.findById(messageId)
  }

  async findByIdWithPopulate(messageId, populateFields) {
    return await Message.findById(messageId).populate(populateFields)
  }

  async findAll(query, options = {}) {
    const { skip = 0, limit = 50, sort = { createdAt: 1 } } = options
    return await Message.find(query).sort(sort).skip(skip).limit(limit)
  }

  async findAllWithPopulate(query, options = {}, populateFields) {
    const { skip = 0, limit = 50, sort = { createdAt: 1 } } = options
    return await Message.find(query)
      .populate(populateFields)
      .sort(sort)
      .skip(skip)
      .limit(limit)
  }

  async countDocuments(query) {
    return await Message.countDocuments(query)
  }

  async findByIdAndUpdate(messageId, updateData, options = {}) {
    return await Message.findByIdAndUpdate(messageId, updateData, { new: true, ...options })
  }

  async findByIdAndDelete(messageId) {
    return await Message.findByIdAndDelete(messageId)
  }

  async updateOne(query, updateData) {
    return await Message.updateOne(query, updateData)
  }
}

module.exports = new MessageRepository()