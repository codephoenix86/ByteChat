const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { USER_ROLES, VALIDATION } = require('../constants')

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      match: VALIDATION.USERNAME.REGEX,
      required: true,
      trim: true,
      unique: true,
      minlength: VALIDATION.USERNAME.MIN_LENGTH,
      maxlength: VALIDATION.USERNAME.MAX_LENGTH,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: VALIDATION.PASSWORD.MIN_LENGTH,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    avatar: String,
    bio: {
      type: String,
      maxlength: VALIDATION.BIO.MAX_LENGTH,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// Indexes for performance
schema.index({ email: 1 })
schema.index({ username: 1 })
schema.index({ lastSeen: -1 })

// JSON transformation
schema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.password
    delete ret.__v
    return ret
  },
})

// Hash password before save
schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Hash password before update
schema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const update = this.getUpdate()
  const newPassword = update.password || update.$set?.password

  if (!newPassword) return next()

  const hashed = await bcrypt.hash(newPassword, 10)
  if (update.$set) update.$set.password = hashed
  else update.password = hashed
  
  next()
})

module.exports = mongoose.model('User', schema)