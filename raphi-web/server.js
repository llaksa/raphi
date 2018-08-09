'use strict'

const debug       = require('debug')('raphi:web')
const http        = require('http')
const path        = require('path')
const express     = require('express')
const cors        = require('cors')
const asyncify    = require('express-asyncify')
const socketio    = require('socket.io')
const chalk       = require('chalk')
const handleError = require('../common/error.js')(chalk)
const RaphiAgent  = require('raphi-agent')

const proxy    = require('./proxy')
const { pipe } = require('./utils')

const port   = process.env.PORT || 8080
const app    = asyncify(express())
const server = http.createServer(app)
const io     = socketio(server)
const agent  = new RaphiAgent()

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', proxy)

// Socket.io / WebSockets
io.on('connect', socket => {
  debug(`Connected ${socket.id}`)

  pipe(agent, socket)

  socket.on('stateSubmit', (data) => {
    //console.log(data)
    let { state, option } = data
    switch (option) {
      case 'fa':
        usrFshAir0 = state
        break
      case 'fw':
        usrFshNutriSol0 = state
        break
      case 'ra':
        usrRndAir0 = state
        break
      case 'rw':
        usrRndNutriSol0 = state
        break
      default:
        break
    }
  })

  socket.on('valueSubmit', (data) => {
    //console.log(data)
    let { value, option } = data
    switch (option) {
      case 'temp':
        usrAirTemp0 = value
        airTempSp = usrAirTemp0
        break
      case 'level':
        usrTnkLevel0 = value
        tnkLevelSp = usrTnkLevel0
        break
      case 'lux':
        usrValLux0 = value
        luxSp = usrValLux0
        break
      default:
        break
    }
  })
})

// Express Error Handler
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

process.on('uncaughtException', handleError.fatal)
process.on('unhandledRejection', handleError.fatal)

server.listen(port, () => {
  console.log(`${chalk.green('[raphi-web]')} server listening on port ${port}`)
  agent.connect()
})
