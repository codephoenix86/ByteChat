const app = require('./src/app')
const http = require('http')

const { port } = require('./src/config/env')
const connectDB = require('./src/config/db')
const { socketSetup } = require('./src/sockets')

const server = http.createServer(app)
const io = socketSetup.init(server)

connectDB()
server.listen(port, () => {
  console.log('server listening on port:', port)
})
