const onlineUsers = {}

exports.onlineUsers = onlineUsers
exports.addSocket = (userId, socketId) => {
  if (!onlineUsers[userId]) onlineUsers[userId] = new Set()
  onlineUsers[userId].add(socketId)
  console.log(onlineUsers)
}
exports.removeSocket = (userId, socketId) => {
  if (!onlineUsers[userId]) return
  onlineUsers[userId].delete(socketId)
  if (onlineUsers[userId].size == 0) delete onlineUsers[userId]
}
exports.getSockets = userId => {
  return onlineUsers[userId]
}
