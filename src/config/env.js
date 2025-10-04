module.exports = {
  port: process.env.PORT || 3000,
  dbUri: process.env.MONGO_URI,
  jwt: {
    access: {
      secret: process.env.JWT_SECRET,
      exp: process.env.JWT_ACCESS_EXPIRES,
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      exp: process.env.JWT_REFRESH_EXPIRES,
    },
  },
}
