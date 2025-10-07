const express = require('express')
const router = express.Router({ mergeParams: true })
const { messageControllers } = require('../../controllers')
const asyncHandler = require('../../utils/asyncHandler')
const {
  validation,
  authentication,
  authorization,
} = require('../../middlewares')

router.param('chatId', validation.isValidId('chat'))
router
  .route('/')
  .post(
    asyncHandler(validation.fields('content')),
    asyncHandler(authentication.accessToken(true)),
    asyncHandler(authorization.chat),
    asyncHandler(messageControllers.sendMessage)
  )
  .get(
    asyncHandler(authentication.accessToken(true)),
    asyncHandler(authorization.chat),
    asyncHandler(messageControllers.getMessages)
  )

module.exports = router
