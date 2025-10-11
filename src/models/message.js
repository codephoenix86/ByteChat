const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['sent', 'read'],
      default: 'sent',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: function (value) {
          return mongoose.Types.ObjectId.isValid(value)
        },
        message: 'user id must valid',
      },
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      validate: {
        validator: function (value) {
          return mongoose.Types.ObjectId.isValid(value)
        },
        message: 'chat id must valid',
      },
    },
    attachments: String,
  },
  { timestamps: true }
)
module.exports = mongoose.model('Message', schema)
