const app = require('./src/app')
const http = require('http')
const logger = require('./src/config/logger')
const env = require('./src/config/validateEnv')
const { connectDB, disconnectDB } = require('./src/config/db')
const { socketServer } = require('./src/sockets')

const server = http.createServer(app)
const io = socketServer.init(server)

// Graceful shutdown handler
const gracefulShutdown = async signal => {
  logger.info(`${signal} received, starting graceful shutdown`)

  // Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed')

    try {
      // Close Socket.io connections
      io.close(() => {
        logger.info('Socket.io server closed')
      })

      // Close database connection
      await disconnectDB()

      logger.info('Graceful shutdown completed')
      process.exit(0)
    } catch (err) {
      logger.error('Error during shutdown:', err)
      process.exit(1)
    }
  })

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

// Start server
;(async () => {
  try {
    // Validate environment variables
    const config = env()
    
    // Connect to database
    await connectDB()

    // Start listening
    server.listen(config.PORT, () => {
      logger.info(`Server listening on port ${config.PORT}`)
      logger.info(`Environment: ${config.NODE_ENV}`)
      logger.info('Application started successfully')
    })

    // Register shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    // Handle uncaught errors
    process.on('uncaughtException', err => {
      logger.error('Uncaught exception:', err)
      gracefulShutdown('uncaughtException')
    })

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection at:', promise, 'reason:', reason)
      gracefulShutdown('unhandledRejection')
    })
  } catch (err) {
    logger.error('Failed to start server:', err)
    process.exit(1)
  }
})()