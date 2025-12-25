const { RefreshToken } = require('../models')

class RefreshTokenRepository {
  async create(tokenData) {
    return await RefreshToken.create(tokenData)
  }

  async findOne(query) {
    return await RefreshToken.findOne(query)
  }

  async deleteOne(query) {
    return await RefreshToken.deleteOne(query)
  }

  async exists(query) {
    return await RefreshToken.exists(query)
  }
}

module.exports = new RefreshTokenRepository()