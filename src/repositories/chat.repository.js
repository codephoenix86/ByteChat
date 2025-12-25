const { Chat } = require('../models')

class ChatRepository {
  async create(chatData) {
    return await Chat.create(chatData)
  }

  async findById(chatId) {
    return await Chat.findById(chatId)
  }

  async findByIdWithPopulate(chatId, populateFields) {
    return await Chat.findById(chatId).populate(populateFields)
  }

  async findAll(query, options = {}) {
    const { skip = 0, limit = 20, sort = { createdAt: -1 } } = options
    return await Chat.find(query).sort(sort).skip(skip).limit(limit)
  }

  async findAllWithPopulate(query, options = {}, populateFields) {
    const { skip = 0, limit = 20, sort = { createdAt: -1 } } = options
    return await Chat.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populateFields)
  }

  async countDocuments(query) {
    return await Chat.countDocuments(query)
  }

  async findByIdAndUpdate(chatId, updateData, options = {}) {
    return await Chat.findByIdAndUpdate(chatId, updateData, { new: true, ...options })
  }

  async findByIdAndDelete(chatId) {
    return await Chat.findByIdAndDelete(chatId)
  }

  async exists(query) {
    return await Chat.exists(query)
  }
}

module.exports = new ChatRepository()