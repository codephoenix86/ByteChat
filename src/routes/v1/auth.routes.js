const express = require('express')
const router = express.Router()
const { auth, validators, validate } = require('../../middlewares')
const { authControllers } = require('../../controllers')
const { asyncHandler } = require('../../utils')

router.post(
  '/signup',
  validators.auth.signup,
  asyncHandler(validate),
  asyncHandler(authControllers.signup)
)

router.post(
  '/login',
  validators.auth.login,
  asyncHandler(validate),
  asyncHandler(authControllers.login)
)

router.post(
  '/logout',
  validators.auth.logout,
  asyncHandler(validate),
  auth.refreshToken,
  asyncHandler(authControllers.logout)
)

router.post(
  '/refresh-token',
  validators.auth.refreshToken,
  asyncHandler(validate),
  auth.refreshToken,
  asyncHandler(authControllers.refreshToken)
)

module.exports = router