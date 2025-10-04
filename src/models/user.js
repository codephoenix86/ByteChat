const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
)

schema.set('toJSON', {
  transform: (doc, ret, options) => {
    ret.id = ret._id
    delete ret._id
    delete ret.password
    delete ret.__v
    return ret
  },
})

schema.pre('save', async function (next) {
  if (!this.isModified()) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

module.exports = mongoose.model('User', schema)
