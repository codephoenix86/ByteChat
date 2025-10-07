const express = require('express')
const router = express.Router()
const asyncHandler = require('../../utils/asyncHandler')
const { validation, authentication } = require('../../middlewares')
const { chatControllers } = require('../../controllers')
const messageRouter = require('./message')

router.param('chatId', validation.isValidId('chat'))

router.get(
  '/',
  asyncHandler(authentication.accessToken(true)),
  asyncHandler(chatControllers.getChats)
)
router.post(
  '/',
  asyncHandler(validation.chat),
  asyncHandler(authentication.accessToken(true)),
  asyncHandler(chatControllers.createChat)
)
router.use('/:chatId/messages', messageRouter)

module.exports = router
