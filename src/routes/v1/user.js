const express = require('express')
const router = express.Router()
const { userControllers } = require('../../controllers')
const { validation, authorization, authentication } = require('../../middlewares')
const asyncHandler = require('../../utils/asyncHandler')

router.param('id', validation.isValidId('user'))
router.get(
  '/',
  asyncHandler(authentication.accessToken(true)),
  asyncHandler(authorization.role('admin')),
  asyncHandler(userControllers.getUsers)
)
router
  .route('/me')
  .get(asyncHandler(authentication.accessToken(true)), asyncHandler(userControllers.getCurrentUser))
  .patch(
    asyncHandler(authentication.accessToken(true)),
    asyncHandler(userControllers.updateCurrentUser)
  )
router.get(
  '/:id',
  asyncHandler(authentication.accessToken(false)),
  asyncHandler(userControllers.getUserById)
)

module.exports = router
