const { body } = require('express-validator')
const { errors } = require('../../utils')
const { VALIDATION } = require('../../constants')

exports.update = [
  body().custom((body, { req }) => {
    if (body.newPassword && !body.oldPassword) {
      throw new errors.ValidationError('Old password is required to change password')
    }
    if (body.newEmail && !body.oldPassword) {
      throw new errors.ValidationError('Old password is required to change email')
    }
    return true
  }),

  body('newUsername')
    .optional()
    .isString()
    .withMessage('Username must be a string')
    .trim()
    .bail()
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

  body('newEmail')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  body('newPassword')
    .optional()
    .isLength({ min: VALIDATION.PASSWORD.MIN_LENGTH })
    .withMessage(`Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters long`)
    .bail()
    .matches(VALIDATION.PASSWORD.REGEX)
    .withMessage(
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
    ),

  body('newBio')
    .optional()
    .isString()
    .withMessage('Bio must be a string')
    .trim()
    .isLength({ max: VALIDATION.BIO.MAX_LENGTH })
    .withMessage(`Bio must not exceed ${VALIDATION.BIO.MAX_LENGTH} characters`),

  body('oldPassword')
    .optional()
    .isString()
    .withMessage('Old password must be a string'),
]

exports.changePassword = [
  body('oldPassword')
    .exists()
    .withMessage('Old password is required')
    .isString()
    .withMessage('Old password must be a string'),

  body('newPassword')
    .exists()
    .withMessage('New password is required')
    .isLength({ min: VALIDATION.PASSWORD.MIN_LENGTH })
    .withMessage(`Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters long`)
    .bail()
    .matches(VALIDATION.PASSWORD.REGEX)
    .withMessage(
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
    ),
]