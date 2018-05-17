'use strict'

const debug       = require('debug')('raphi:api')
const http        = require('http')
const chalk       = require('chalk')
const handleError = require('../common/error.js')(chalk)
const express     = require('express')
const asyncify    = require('express-asyncify')
const api         = require('./api')

const port   = process.env.PORT || 3000
const app    = asyncify(express())
const server = http.createServer(app)

app.use('/api', api)

// Express Error Handler
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

if (!module.parent) {
  process.on('uncaughtException', handleError.fatal)
  process.on('unhandledRejection', handleError.fatal)

  server.listen(port, () => {
    console.log(`${chalk.green('[raphi-api]')} server listening on port ${port}`)
  })
}

module.exports = server
