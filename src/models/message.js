const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Message', schema)
