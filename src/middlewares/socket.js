const verify = require('../utils/verifyToken')
const {
  jwt: { access },
} = require('../config/env')

exports.authentication = (socket, next) => {
  const { token } = socket.handshake.auth
  if (!token) next(new Error('authentication token is missing'))
  try {
    const { id } = verify(token, access.secret)
    socket.userId = id
    next()
  } catch (err) {
    next(new Error(err.message))
  }
}
