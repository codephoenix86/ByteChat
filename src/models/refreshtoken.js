const mongoose = require('mongoose')
const ms = require('ms')
const {
  jwt: { refresh },
} = require('../config/env')
const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshToken: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: Math.floor(ms(refresh.exp) / 1000) },
})
module.exports = mongoose.model('RefreshToken', schema)
