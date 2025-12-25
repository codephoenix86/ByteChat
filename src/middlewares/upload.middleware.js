const multer = require('multer')
const path = require('path')
const { errors } = require('../utils')
const { VALIDATION } = require('../constants')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/public/avatars')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${req.user.id}-${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  if (!VALIDATION.FILE.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(
      new errors.ValidationError(
        `Only ${VALIDATION.FILE.ALLOWED_IMAGE_TYPES.join(', ')} files are allowed`
      )
    )
  }
  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: VALIDATION.FILE.MAX_SIZE,
  },
})

module.exports = upload