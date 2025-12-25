const { body } = require('express-validator')
const { errors } = require('../../utils')
const { VALIDATION } = require('../../constants')

exports.signup = [
  body('email')
    .exists()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  body('username')
    .exists()
    .withMessage('Username is required')
    .bail()
    .isString()
    .withMessage('Username must be a string')
    .bail()
    .trim()
    .isLength({
      min: VALIDATION.USERNAME.MIN_LENGTH,
      max: VALIDATION.USERNAME.MAX_LENGTH,
    })
    .withMessage(
      `Username must be ${VALIDATION.USERNAME.MIN_LENGTH}-${VALIDATION.USERNAME.MAX_LENGTH} characters long`
    )
    .bail()
    .matches(VALIDATION.USERNAME.REGEX)
    .withMessage(
      'Username must start with a letter and can only contain letters, digits, underscores, and dots'
    ),

  body('password')
    .exists()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: VALIDATION.PASSWORD.MIN_LENGTH })
    .withMessage(`Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters long`)
    .bail()
    .matches(VALIDATION.PASSWORD.REGEX)
    .withMessage(
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
    ),
]

exports.login = [
  body().custom(body => {
    if (!body.username && !body.email) {
      throw new errors.ValidationError('Either username or email is required')
    }
    return true
  }),

  body('email').optional().isEmail().withMessage('Invalid email').normalizeEmail(),

  body('username')
    .optional()
    .isString()
    .withMessage('Username must be a string')
    .trim(),

  body('password')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
]

exports.logout = [
  body('refreshToken')
    .exists()
    .withMessage('Refresh token is required')
    .bail()
    .isString()
    .withMessage('Refresh token must be a string'),
]

exports.refreshToken = [
  body('refreshToken')
    .exists()
    .withMessage('Refresh token is required')
    .bail()
    .isString()
    .withMessage('Refresh token must be a string'),
]