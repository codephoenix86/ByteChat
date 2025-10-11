const express = require('express')
const router = express.Router()
const asyncHandler = require('../../utils/asyncHandler')
const { validation, authentication } = require('../../middlewares')
const { chatControllers } = require('../../controllers')
const messageRouter = require('./message')

router.param('chatId', validation.isValidId('chat'))

router.use(asyncHandler(authentication.accessToken(true)))

router.get('/', asyncHandler(chatControllers.getChats))
router.post(
  '/',
  asyncHandler(validation.chat),
  asyncHandler(chatControllers.createChat)
)
router.use('/:chatId/messages', messageRouter)
router.post('/:chatId/join', asyncHandler(chatControllers.joinGroup))
router.delete('/:chatId/leave', asyncHandler(chatControllers.leaveGroup))
router.patch(
  '/:chatId/admin',
  asyncHandler(validation.fields('newAdmin')),
  asyncHandler(chatControllers.makeAdmin)
)
module.exports = router
