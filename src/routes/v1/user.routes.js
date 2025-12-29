const express = require('express')
const router = express.Router()
const { userControllers } = require('../../controllers')
const { auth, upload, validators, validate, param } = require('../../middlewares')
const { asyncHandler } = require('../../utils')

// Protected routes - Current user
router
  .route('/me')
  .get(auth.accessToken, asyncHandler(userControllers.getCurrentUser))
  .patch(
    auth.accessToken,
    validators.user.update,
    asyncHandler(validate),
    asyncHandler(userControllers.updateCurrentUser)
  )
  .delete(auth.accessToken, asyncHandler(userControllers.deleteCurrentUser))

// Avatar as sub-resource
router
  .route('/me/avatar')
  .put(
    auth.accessToken,
    upload.single('avatar'),
    asyncHandler(userControllers.uploadAvatar)
  )
  .delete(auth.accessToken, asyncHandler(userControllers.deleteAvatar))

// Password management
router.post(
  '/me/password',
  auth.accessToken,
  validators.user.changePassword,
  asyncHandler(validate),
  asyncHandler(userControllers.changePassword)
)

// Parameterized routes 
router.param('id', param.validateId('user'))

// Public routes
router.get('/', asyncHandler(userControllers.getUsers))
router.get('/:id', asyncHandler(userControllers.getUserById))

module.exports = router