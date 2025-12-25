const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const logger = require('../../config/logger')
const { HTTP_STATUS } = require('../../constants')

router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    checks: {
      database: 'unknown',
    },
  }

  try {
    const dbState = mongoose.connection.readyState
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    if (dbState === 1) {
      health.checks.database = 'connected'
    } else {
      health.checks.database = 'disconnected'
      health.status = 'DEGRADED'
    }
  } catch (error) {
    logger.error('Health check error:', error)
    health.checks.database = 'error'
    health.status = 'DEGRADED'
  }

  const statusCode = health.status === 'OK' ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE
  res.status(statusCode).json(health)
})

module.exports = router