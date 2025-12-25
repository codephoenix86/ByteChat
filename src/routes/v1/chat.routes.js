const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../utils')
const { auth, validators, validate, param } = require('../../middlewares')
const { chatControllers } = require('../../controllers')
const messageRouter = require('./message.routes')

router.param('chatId', param.validateId('chat'))
router.param('userId', param.validateId('user'))

// All chat routes require authentication
router.use(auth.accessToken)

// Main chat resource - Full CRUD
router
  .route('/')
  .get(asyncHandler(chatControllers.getChats))
  // Accepts: ?page=1&limit=20&type=group&sort=-createdAt
  .post(
    validators.chat.create,
    asyncHandler(validate),
    asyncHandler(chatControllers.createChat)
  )

router
  .route('/:chatId')
  .get(asyncHandler(chatControllers.getChat))
  .patch(
    validators.chat.update,
    asyncHandler(validate),
    asyncHandler(chatControllers.updateChat)
  )
  .delete(asyncHandler(chatControllers.deleteChat))

// Members as sub-resource (RESTful)
router
  .route('/:chatId/members')
  .get(asyncHandler(chatControllers.getMembers))
  .post(
    validators.chat.addMember,
    asyncHandler(validate),
    asyncHandler(chatControllers.addMember)
  )

router.delete('/:chatId/members/:userId', asyncHandler(chatControllers.removeMember))

// Nested message routes
router.use('/:chatId/messages', messageRouter)

module.exports = router