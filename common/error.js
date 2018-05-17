'use strict'

module.exports = function (callback) {
  return {
    fatal: function fatal (err) {
      console.error(`${callback.red('[fatal error]')} ${err.message}`)
      console.error(err.stack)
      process.exit(1)
    },
    simple: function simple (err) {
      console.error(`${callback.red('[error]')} ${err.message}`)
      console.error(err.stack)
    }
  }
}
