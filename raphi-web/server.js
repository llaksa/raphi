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
    console.log(data)
    let { state, option } = data
    switch (option) {
      case 'fa':
        stateFreshAir0 = state
        break
      case 'fw':
        stateFreshWater0 = state
        break
      case 'ra':
        stateRoundAir0 = state
        break
      case 'rw':
        stateRoundWater0 = state
        break
      default:
        break
    }
  })

  socket.on('valueSubmit', (data) => {
    console.log(data)
    let { value, option } = data
    switch (option) {
      case 'temp':
        valueTemp0 = value
        break
      case 'ra':
        valueLevel0 = value
        break
      case 'rw':
        valueLux0 = value
        break
      default:
        break
    }
  })
})

// ==================== JOHNNY FIVE ZONE =======================:
const five  = require('johnny-five')
const board = new five.Board()

let stateFreshAir0
let stateFreshAir1
let stateFreshWater0
let stateFreshWater1
let stateRoundAir0
let stateRoundAir1
let stateRoundWater0
let stateRoundWater1
let valueTemp0
let valueTemp1
let valueLevel0
let valueLevel1
let valueLux0
let valueLux1

board.on('ready', () => {

  // ======= Fresh Air =======
  const relayFA = new five.Relay({
    pin: 7,
    type: "NC"
  })

  setInterval(() => {
    if (stateFreshAir0 != stateFreshAir1) {
      if (stateFreshAir0) {
        relayFA.on()
        stateFreshAir1 = stateFreshAir0
      } else {
        relayFA.off()
        stateFreshAir1 = stateFreshAir0
      }
    }
  }, 300)

  // ======= Fresh Water =======
  const relayFW = new five.Relay({
    pin: 8,
    type: "NC"
  })

  setInterval(() => {
    if (stateFreshWater0 != stateFreshWater1) {
      if (stateFreshWater0) {
        relayFW.on()
        stateFreshWater1 = stateFreshWater0
      } else {
        relayFW.off()
        stateFreshWater1 = stateFreshWater0
      }
    }
  }, 300)

  // ======= Round Air =======
  const relayRA = new five.Relay({
    pin: 12,
    type: "NC"
  })

  setInterval(() => {
    if (stateRoundAir0 != stateRoundAir1) {
      if (stateRoundAir0) {
        relayRA.on()
        stateRoundAir1 = stateRoundAir0
      } else {
        relayRA.off()
        stateRoundAir1 = stateRoundAir0
      }
    }
  }, 300)

  // ======= Round Water =======
  const relayRW = new five.Relay({
    pin: 13,
    type: "NC"
  })

  setInterval(() => {
    if (stateRoundWater0 != stateRoundWater1) {
      if (stateRoundWater0) {
        relayRW.on()
        stateRoundWater1 = stateRoundWater0
      } else {
        relayRW.off()
        stateRoundWater1 = stateRoundWater0
      }
    }
  }, 300)

  board.repl.inject({
    relay : relay
  })

  // ======= Temp Control =======
  let tempSetpoint = valueTemp0

  // ======= Level Control =======
  let levelSetpoint = valueLevel0

  // ======= Lux Control =======
  let luxSetpoint = valueLux0

})
// =============================================================

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

