'use strict'

module.exports = function (callback) {
  return {
    db: {
      database: process.env.DB_NAME || 'raphi_database',
      username: process.env.DB_USER || 'raphi_role',
      password: process.env.DB_PASS || 'raphi_password',
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      logging: s => callback(s)
    },
    auth: {
      secret: process.env.SECRET || 'raphi_secret'
    }
  }
}
