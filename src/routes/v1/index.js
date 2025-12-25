const express = require('express')
const router = express.Router()

// Health check (no auth required)
router.use('/', require('./health.routes'))

// API routes
router.use('/auth', require('./auth.routes'))
router.use('/users', require('./user.routes'))
router.use('/chats', require('./chat.routes'))

module.exports = router