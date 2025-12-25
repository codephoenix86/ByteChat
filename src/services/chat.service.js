const { chatRepository, userRepository } = require('../repositories')
const { errors } = require('../utils')
const { ValidationError, NotFoundError, AuthorizationError } = errors
const { CHAT_TYPES } = require('../constants')
const logger = require('../config/logger')

class ChatService {
  async createChat(chatData, creatorId) {
    const { participants, type, groupName } = chatData

    // Add creator to participants
    const allParticipants = [...new Set([...participants, creatorId])]

    // Verify all participants exist
    const count = await userRepository.countDocuments({
      _id: { $in: allParticipants },
    })

    if (count !== allParticipants.length) {
      throw new ValidationError('One or more participants do not exist')
    }

    // Set admin for group chats
    const admin = type === CHAT_TYPES.GROUP ? creatorId : undefined

    const chat = await chatRepository.create({
      type,
      groupName: type === CHAT_TYPES.GROUP ? groupName : undefined,
      admin,
      participants: allParticipants,
    })

    logger.info('Chat created successfully', {
      chatId: chat._id,
      type,
      creatorId,
    })

    return this.formatChat(chat)
  }

  async getUserChats(userId, options = {}) {
    const { filter = {}, skip = 0, limit = 20, sort = { createdAt: -1 } } = options

    // Build query
    const query = {
      participants: userId,
      ...filter,
    }

    // Get total count
    const total = await chatRepository.countDocuments(query)

    // Get chats with pagination
    const populateFields = [
      { path: 'participants', select: 'username avatar' },
      { path: 'admin', select: 'username' }
    ]
    const chats = await chatRepository.findAllWithPopulate(query, { skip, limit, sort }, populateFields)

    return {
      chats: chats.map(chat => this.formatChat(chat)),
      total,
    }
  }

  async getChatById(chatId, userId) {
    const populateFields = [
      { path: 'participants', select: 'username avatar email' },
      { path: 'admin', select: 'username avatar' }
    ]
    const chat = await chatRepository.findByIdWithPopulate(chatId, populateFields)

    if (!chat) {
      throw new NotFoundError('Chat not found')
    }

    // Verify user is a participant
    if (!chat.participants.some(p => p._id.toString() === userId)) {
      throw new AuthorizationError('You are not a member of this chat')
    }

    return this.formatChat(chat)
  }

  async updateChat(chatId, userId, updateData) {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw new NotFoundError('Chat not found')
    }

    if (chat.type === CHAT_TYPES.PRIVATE) {
      throw new ValidationError('Cannot update private chat')
    }

    // Only admin can update chat
    if (chat.admin.toString() !== userId) {
      throw new AuthorizationError('Only admin can update chat')
    }

    // Update allowed fields
    const allowedUpdates = ['groupName', 'groupPicture', 'admin']
    const updates = {}
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field]
      }
    })

    // Verify new admin is a participant
    if (updates.admin) {
      if (!chat.participants.includes(updates.admin)) {
        throw new ValidationError('New admin must be a member of the group')
      }
    }

    const updated = await chatRepository.findByIdAndUpdate(chatId, { $set: updates })

    logger.info('Chat updated', { chatId, userId, updates })

    return this.formatChat(updated)
  }

  async deleteChat(chatId, userId) {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw new NotFoundError('Chat not found')
    }

    if (chat.type === CHAT_TYPES.PRIVATE) {
      throw new ValidationError('Cannot delete private chat')
    }

    // Only admin can delete chat
    if (chat.admin.toString() !== userId) {
      throw new AuthorizationError('Only admin can delete chat')
    }

    await chatRepository.findByIdAndDelete(chatId)
    logger.info('Chat deleted', { chatId, userId })
  }

  async addMember(chatId, userId, memberIdToAdd = null) {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw new NotFoundError('Chat not found')
    }

    if (chat.type === CHAT_TYPES.PRIVATE) {
      throw new ValidationError('Cannot add members to private chat')
    }

    const memberToAdd = memberIdToAdd || userId

    // If adding someone else, must be admin
    if (memberIdToAdd && chat.admin.toString() !== userId) {
      throw new AuthorizationError('Only admin can add other members')
    }

    if (chat.participants.includes(memberToAdd)) {
      throw new ValidationError('User is already a member of this group')
    }

    await chatRepository.findByIdAndUpdate(chatId, {
      $addToSet: { participants: memberToAdd },
    })

    logger.info('Member added to chat', { chatId, userId, memberToAdd })
  }

  async removeMember(chatId, userId, memberIdToRemove) {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw new NotFoundError('Chat not found')
    }

    if (chat.type === CHAT_TYPES.PRIVATE) {
      throw new ValidationError('Cannot remove members from private chat')
    }

    // Can remove self or admin can remove others
    const isSelf = memberIdToRemove === userId
    const isAdmin = chat.admin && chat.admin.toString() === userId

    if (!isSelf && !isAdmin) {
      throw new AuthorizationError('Only admin can remove other members')
    }

    // Admin cannot be removed unless transferring ownership
    if (chat.admin && chat.admin.toString() === memberIdToRemove && chat.participants.length > 1) {
      throw new AuthorizationError('Admin must transfer ownership before leaving')
    }

    if (!chat.participants.includes(memberIdToRemove)) {
      throw new ValidationError('User is not a member of this group')
    }

    await chatRepository.findByIdAndUpdate(chatId, {
      $pull: { participants: memberIdToRemove },
    })

    // Delete chat if empty
    if (chat.participants.length === 1) {
      await chatRepository.findByIdAndDelete(chatId)
      logger.info('Empty group deleted', { chatId })
    }

    logger.info('Member removed from chat', { chatId, userId, memberIdToRemove })
  }

  async getMembers(chatId, userId) {
    const populateFields = { path: 'participants', select: 'username avatar email bio' }
    const chat = await chatRepository.findByIdWithPopulate(chatId, populateFields)

    if (!chat) {
      throw new NotFoundError('Chat not found')
    }

    // Verify user is a participant
    if (!chat.participants.some(p => p._id.toString() === userId)) {
      throw new AuthorizationError('You are not a member of this chat')
    }

    return chat.participants
  }

  formatChat(chat) {
    if (!chat) return null

    return {
      id: chat._id,
      type: chat.type,
      name: chat.groupName,
      picture: chat.groupPicture,
      admin: chat.admin,
      participants: chat.participants,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }
  }
}

module.exports = new ChatService()