class ApiResponse {
  constructor(message, data, status = 200, success = true) {
    this.message = message
    this.success = success
    this.status = status
    this.data = data
    this.timestamp = new Date().toISOString()
  }
}

module.exports = ApiResponse