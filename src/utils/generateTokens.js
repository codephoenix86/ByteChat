const jwt = require('jsonwebtoken')
const generateTokens = (payload, ...tokens) => {
  const result = tokens.map(token => jwt.sign(payload, token.secret, { expiresIn: token.exp }))
  return result
}
module.exports = generateTokens
