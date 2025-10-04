const { AuthError } = require('../utils/errors')
module.exports = (err, req, res, next) => {
  console.log(err.name)
  const { message, timestamp, status, errors } = err
  console.log(message)
  if (err.operational)
    res.status(status).json({ success: false, message, status, errors, timestamp })
  else
    res.status(500).json({
      success: false,
      message: 'internal server error',
      status: 500,
      timestamp: new Date().toISOString(),
    })
}
