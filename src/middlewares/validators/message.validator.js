const { body } = require('express-validator')

exports.sendMessage = [
  body('content')
    .exists()
    .withMessage('Message content is required')
    .bail()
    .isString()
    .withMessage('Message content must be text')
    .trim()
    .notEmpty()
    .withMessage('Message content cannot be empty')
    .isLength({ max: 5000 })
    .withMessage('Message content must not exceed 5000 characters'),
]

exports.updateMessage = [
  body('content')
    .exists()
    .withMessage('Message content is required')
    .bail()
    .isString()
    .withMessage('Message content must be text')
    .trim()
    .notEmpty()
    .withMessage('Message content cannot be empty')
    .isLength({ max: 5000 })
    .withMessage('Message content must not exceed 5000 characters'),
]