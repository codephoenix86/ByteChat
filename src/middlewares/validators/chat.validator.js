const { body } = require('express-validator')
const mongoose = require('mongoose')
const { errors } = require('../../utils')
const { CHAT_TYPES } = require('../../constants')

exports.create = [
  body().custom(body => {
    if (body.type === CHAT_TYPES.GROUP && !body.groupName) {
      throw new errors.ValidationError('Group name is required for group chats')
    }
    return true
  }),

  body('type')
    .exists()
    .withMessage('Chat type is required')
    .bail()
    .isIn(Object.values(CHAT_TYPES))
    .withMessage(`Chat type must be either ${Object.values(CHAT_TYPES).join(' or ')}`),

  body('groupName')
    .optional()
    .isString()
    .withMessage('Group name must be a string')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Group name must be 1-50 characters long'),

  body('participants')
    .exists()
    .withMessage('Participants are required')
    .bail()
    .isArray()
    .withMessage('Participants must be an array')
    .bail()
    .custom((value, { req }) => {
      const type = req.body.type
      const userIds = value.map(String)
      userIds.push(req.user.id)
      const uniqueUserIds = new Set(userIds)

      if (type === CHAT_TYPES.PRIVATE && uniqueUserIds.size !== 2) {
        throw new errors.ValidationError('Private chat must have exactly 2 unique participants')
      }

      if (type === CHAT_TYPES.GROUP && uniqueUserIds.size < 2) {
        throw new errors.ValidationError('Group chat must have at least 2 unique participants')
      }

      if (userIds.length !== uniqueUserIds.size) {
        throw new errors.ValidationError('Participants must be unique')
      }

      return true
    })
    .bail()
    .custom(value => {
      for (const id of value) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new errors.ValidationError('One or more participant IDs are invalid')
        }
      }
      return true
    }),
]

exports.update = [
  body('groupName')
    .optional()
    .isString()
    .withMessage('Group name must be a string')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Group name must be 1-50 characters long'),

  body('groupPicture').optional().isString().withMessage('Group picture must be a string'),

  body('admin')
    .optional()
    .isString()
    .withMessage('Admin must be a string')
    .custom(value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new errors.ValidationError('Invalid admin ID')
      }
      return true
    }),
]

exports.addMember = [
  body('userId')
    .optional()
    .isString()
    .withMessage('User ID must be a string')
    .bail()
    .custom(value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new errors.ValidationError('Invalid user ID')
      }
      return true
    }),
]