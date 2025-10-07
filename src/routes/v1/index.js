const express = require('express')
const router = express.Router()
router.use('/auth', require('./auth'))
router.use('/users', require('./user'))
router.use('/chats', require('./chat'))
module.exports = router