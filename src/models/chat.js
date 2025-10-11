const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  type: { type: String, enum: ['private', 'group'], required: true },
  groupName: String,
  groupAvatar: String,
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    validate: {
      validator: function (arr) {
        if (!Array.isArray(arr)) return false
        if (this.type === 'group') return arr.length >= 2
        if (this.type === 'private') return arr.length === 2
        return false
      },
      message: 'invalid number of users',
    },
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
})
module.exports = mongoose.model('Chat', schema)
