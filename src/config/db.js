const mongoose = require('mongoose')
const logger = require('./logger')

const connectDB = async (retries = 5) => {
  const dbUri = process.env.MONGO_URI

  try {
    await mongoose.connect(dbUri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    logger.info('Database connected successfully')

    // Connection event handlers
    mongoose.connection.on('error', err => {
      logger.error('Database connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('Database disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('Database reconnected')
    })
  } catch (err) {
    logger.error('Database connection failed:', {
      error: err.message,
      retries: retries,
    })

    if (retries > 0) {
      logger.info(`Retrying connection... (${retries} attempts left)`)
      await new Promise(resolve => setTimeout(resolve, 5000))
      return connectDB(retries - 1)
    }

    logger.error('Failed to connect to database after multiple attempts')
    process.exit(1)
  }
}

const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    logger.info('Database connection closed')
  } catch (err) {
    logger.error('Error closing database connection:', err)
  }
}

module.exports = { connectDB, disconnectDB }