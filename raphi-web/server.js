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
        usrStateFA0 = state
        break
      case 'fw':
        usrStateFW0 = state
        break
      case 'ra':
        usrStateRA0 = state
        break
      case 'rw':
        usrStateRW0 = state
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
        usrValTemp0 = value
        break
      case 'ra':
        usrValLevel0 = value
        break
      case 'rw':
        usrValLux0 = value
        break
      default:
        break
    }
  })
})

// ==================== JOHNNY FIVE ZONE =======================:

/*
   Relays Digital Pins  : 2, 4, 8, 12, 13
   Sensors Analog Pins  : A0
   Sensors Digital Pins : 7, 10 (PWM Pin 10 used as digital!)
   PWM Pins             : 9
 */

const five  = require('johnny-five')
const board = new five.Board()

let usrStateFA0
let usrStateFA1
let usrStateFW0
let usrStateFW1
let usrStateRA0
let usrStateRA1
let usrStateRW0
let usrStateRW1
let usrValTemp0
let usrValTemp1
let usrValLevel0
let usrValLevel1
let usrValLux0
let usrvalLux1

board.on('ready', async () => {

  // ======= Fresh Air =======
  const relayFA = new five.Relay({
    pin: 7,
    type: "NC"
  })

  setInterval(() => {
    if (usrStateFA0 != usrStateFA1) {
      if (usrStateFA0) {
        relayFA.on()
        usrStateFA1 = usrStateFA0
      } else {
        relayFA.off()
        usrStateFA1 = usrStateFA0
      }
    }
  }, 300)

  // ======= Fresh Water =======
  const relayFW = new five.Relay({
    pin: 8,
    type: "NC"
  })

  setInterval(() => {
    if (usrStateFW0 != usrStateFW1) {
      if (usrStateFW0) {
        relayFW.on()
        usrStateFW1 = usrStateFW0
      } else {
        relayFW.off()
        usrStateFW1 = usrStateFW0
      }
    }
  }, 300)

  // ======= Round Air =======
  const relayRA = new five.Relay({
    pin: 12,
    type: "NC"
  })

  setInterval(() => {
    if (usrStateRA0 != usrStateRA1) {
      if (usrStateRA0) {
        relayRA.on()
        usrStateRA1 = usrStateRA0
      } else {
        relayRA.off()
        usrStateRA1 = usrStateRA0
      }
    }
  }, 300)

  // ======= Round Water =======
  const relayRW = new five.Relay({
    pin: 13,
    type: "NC"
  })

  setInterval(() => {
    if (usrStateRW0 != usrStateRW1) {
      if (usrStateRW0) {
        relayRW.on()
        usrStateRW1 = usrStateRW0
      } else {
        relayRW.off()
        usrStateRW1 = usrStateRW0
      }
    }
  }, 300)

  // ======= TEMP CONTROL =======
  let tempSetpoint = usrValTemp0

  const relayTemp = new five.Relay({
    pin: 2,
    type: "NO"
  })

  const temperature = new five.Thermometer({
    controller: "LM35",
    pin: "A0",
    freq: 25
  })

  let temp1 = 0
  temperature.on("data", function() {
    let temp0 = this.celsius * 0.0609 + temp1 * 0.9391
    tempOut = temp0
    //output = Math.round(y0)
    //console.log("temp: " + output)
    //console.log(this.celsius)
    temp1 = temp0
    tempPidController(tempSetpoint)
  })

  board.pinMode(9, five.Pin.PWM)
  async function pwmFan (x) {
    if (x < 90) {
      relayTemp.close()
    } else if (x > 255) {
      relayTemp.open()
      board.analogWrite(9, 255)
    } else {
      relayTemp.open()
      board.analogWrite(9, x)
    }
  }

  // ======= Saving Temperature Data =======
  let tempIn
  let tempOut

  async function tempGrabarOne () {
      await fs.appendFile('temperature.txt', `\n${tempOut}`, () => console.log(`Temperature: ${tempOut}`))
      await fs.appendFile('pwm.txt', `\n${tempIn}`, () => console.log(`PWM: ${tempIn}`) )
  }

  async function tempGrabar () {
    await fs.unlink('temperature.txt', () => console.log(`Temperature: ${tempOut}`))
    await fs.unlink('pwm.txt', () => console.log(`PWM: ${tempIn}`))
    for (let k = 0; k < 5000; k++) {
      await tempGrabarOne()
      await delay(25)
    }
  }

  async function tempSavingData () {
    tempIn = 0
    await pwmFan(tempIn)

    tempGrabar()

    await delay(15000)

    tempIn = 255
    await pwmFan(tempIn)

    await delay(112000)

    tempIn = 0
    await pwmFan(tempIn)
  }

  let temp_pi0  = temp_pi1  = 0
  let temp_err0 = temp_err1 = 0
  async function tempPidController (sp) {
    temp_err1     = temp_err0
    temp_err0 = tempOut - sp
    let temp_pi0  = temp_pi1 + 52.1 * temp_err0 - 52.09 * temp_err1
    pi1      = pi0
    console.log("pi0  :  " + temp_pi0)
    console.log("err0 :  " + temp_err0)
    await pwmFan(temp_pi0)
    /*
    if (err0 > 0) {
      await pwmFan(pi0)
    } else {
      await pwmFan(0)
    }
    */
  }

  await pwmFan(0)

  // ======= LEVEL CONTROL =======
  let levelSetpoint = valueLevel0

  const proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  })

  let level1 = 0

  proximity.on("data", async function() {
    let level0 = this.cm * 0.0609 + level1 * 0.9391
    levelOut = 22 - level0
    //console.log(output)
    level1 = level0
    await levelPidController(levelSetpoint)
  })

  // ======= Saving Distance Data =======
  let levelOut
  let levelIn
  async function levelGrabarOne () {
    await fs.appendFile('distance.txt', `\n${levelOut}`, () => console.log(`Distance: ${levelOut}`))
    await fs.appendFile('pwm.txt', `\n${levelIn}`, () => console.log(`PWM: ${levelIn}`) )
  }

  async function levelGrabar () {
    await fs.unlink('distance.txt', () => console.log(`Distance: ${levelOut}`))
    await fs.unlink('pwm.txt', () => console.log(`PWM: ${levelIn}`))
    for (let k = 0; k < 5000; k++) {
      await levelGrabarOne()
      await delay(25)
    }
  }

  async function levelSavingData () {
    levelIn = 0
    await pwmPump(levelIn)

    levelGrabar()

    await delay(5000)

    levelIn = 255
    await pwmPump(levelIn)
    await delay(10000)

    levelIn = 0
    await pwmPump(levelIn)
    await delay(5000)
    levelIn = 255
    await pwmPump(levelIn)
    await delay(10000)

    levelIn = 0
    await pwmPump(levelIn)
    await delay(5000)
    levelIn = 255
    await pwmPump(levelIn)
    await delay(10000)

    levelIn = 0
    await pwmPump(levelIn)
    await delay(5000)
    levelIn = 255
    await pwmPump(levelIn)
    await delay(10000)

    levelIn = 0
    await pwmPump(levelIn)
    await delay(5000)
    levelIn = 255
    await pwmPump(levelIn)
    await delay(10000)

    levelIn = 0
    await pwmPump(levelIn)
    await delay(5000)
    levelIn = 255
    await pwmPump(levelIn)
    await delay(10000)

    levelIn = 0
    await pwmPump(levelIn)
    await delay(5000)
    levelIn = 255
    await pwmPump(levelIn)
    await delay(10000)

    levelIn = 0
    await pwmPump(levelIn)
    await delay(5000)
    levelIn = 255
    await pwmPump(levelIn)
    await delay(10000)

    levelIn = 0
    await pwmPump(levelIn)
    await delay(5000)
    levelIn = 255
    await pwmPump(levelIn)
    await delay(10000)

    levelIn = 0
    await pwmPump(levelIn)
    await delay(5000)
    levelIn = 255
    await pwmPump(levelIn)
    await delay(10000)

    levelIn = 0
    await pwmPump(levelIn)
  }

  // ======= Level Controller =======
  // Analog Pin 10 As Digital
  new five.Pin({
    pin: 10,
    type: "digital"
  })

  const motor = new five.Motor(
    { pins: { dir: 10, pwm: 9 }, invertPWM: true }
  )

  async function pwmPump (x) {
    if (x < 200 || lvl_err0 < 0) {
      motor.fwd(200)
    } else if (x > 255) {
      motor.fwd(255)
    } else {
      motor.fwd(200)
    }
  }

  let lvl_pi0  = lvl_pi1  = 0
  let lvl_err0 = lvl_err1 = 0
  async function levelPidController (sp) {
    lvl_err1     = lvl_err0
    lvl_err0 = sp - levelOut
    let lvl_pi0  = lvl_pi1 + 15.63 * lvl_err0 - 15.63 * lvl_err1
    lvl_pi1      = lvl_pi0
    console.log("pi0  :  " + lvl_pi0)
    console.log("err0 :  " + lvl_err0)
    await pwmPump(lvl_pi0 * 5)
  }

  await pwmPump(0)

  // ======= Lux Control =======
  let luxSetpoint = valueLux0

  board.repl.inject({
    relayTemp : relayTemp,
    pwmFan : pwmFan,
    pwmPump : pwmPump,
    tempSavingData : tempSavingData,
    levelSavingData : levelSavingData,
    tempPidController : tempPidController,
    levelPidController : levelPidController,
    motor : motor,
    relay : relay
  })

  // ======= UTILS =======
  async function delay (time) {
    return new Promise(resolve => {
      setTimeout(resolve, time)
    })
  }

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
