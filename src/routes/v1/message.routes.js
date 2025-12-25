const express = require('express')
const router = express.Router({ mergeParams: true })
const { messageControllers } = require('../../controllers')
const { asyncHandler } = require('../../utils')
const { auth, validators, validate, param } = require('../../middlewares')

router.param('messageId', param.validateId('message'))

// Apply auth to all routes
router.use(auth.accessToken)

router
  .route('/')
  .post(
    validators.message.sendMessage,
    asyncHandler(validate),
    asyncHandler(messageControllers.sendMessage)
  )
  .get(asyncHandler(messageControllers.getMessages))

router
  .route('/:messageId')
  .get(asyncHandler(messageControllers.getMessage))
  .patch(
    validators.message.updateMessage,
    asyncHandler(validate),
    asyncHandler(messageControllers.updateMessage)
  )
  .delete(asyncHandler(messageControllers.deleteMessage))

module.exports = router