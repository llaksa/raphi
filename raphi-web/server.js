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

  // ======= Temp Control =======
  let tempSetpoint = usrValTemp0

  let input
  let output

  const relayTemp = new five.Relay({
    pin: 8,
    type: "NO"
  })

  const temp = new five.Thermometer({
    controller: "LM35",
    pin: "A0",
    freq: 25
  })

  let y1 = 0
  temp.on("data", function() {
    let y0 = this.celsius * 0.0609 + y1 * 0.9391
    output = y0
    //output = Math.round(y0)
    //console.log("temp: " + output)
    //console.log(this.celsius)
    y1 = y0
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

  // SAVING DATA ============================================================================================
  async function tempGrabarOne () {
      await fs.appendFile('temperature.txt', `\n${output}`, () => console.log(`Temperature: ${output}`))
      await fs.appendFile('pwm.txt', `\n${input}`, () => console.log(`PWM: ${input}`) )
  }

  async function tempGrabar () {
    await fs.unlink('temperature.txt', () => console.log(`Temperature: ${output}`))
    await fs.unlink('pwm.txt', () => console.log(`PWM: ${input}`))
    for (let k = 0; k < 5000; k++) {
      await tempGrabarOne()
      await delay(25)
    }
  }

  async function delay (time) {
    return new Promise(resolve => {
      setTimeout(resolve, time)
    })
  }

  async function tempSavingData () {
    input = 0
    await pwmFan(input)

    tempGrabar()

    await delay(15000)

    input = 255
    await pwmFan(input)

    await delay(112000)

    input = 0
    await pwmFan(input)
  }

  let pi0  = pi1  = 0
  let err0 = err1 = 0
  async function tempPidController (sp) {
    err1     = err0
    err0 = output - sp
    let pi0  = pi1 + 52.1 * err0 - 52.09 * err1
    pi1      = pi0
    console.log("pi0  :  " + pi0)
    console.log("err0 :  " + err0)
    await pwmFan(pi0)
    /*
    if (err0 > 0) {
      await pwmFan(pi0)
    } else {
      await pwmFan(0)
    }
    */
  }

  await pwmFan(0)

  // ======= Level Control =======
  let levelSetpoint = valueLevel0

  const proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  })

  let y1 = 0
  proximity.on("data", async function() {
    let y0 = this.cm * 0.0609 + y1 * 0.9391
    output = 22 - y0
    //console.log(output)
    y1 = y0
    await levelPidController(levelSetpoint)
  })

  const motor = new five.Motor(
    { pins: { dir: 8, pwm: 9 }, invertPWM: true }
  )

  async function pwmPump (x) {
    if (x < 200 || err0 < 0) {
      motor.fwd(200)
    } else if (x > 255) {
      motor.fwd(255)
    } else {
      motor.fwd(200)
    }
  }

  // SAVING DATA
  async function levelGrabarOne () {
    await fs.appendFile('distance.txt', `\n${output}`, () => console.log(`Distance: ${output}`))
    await fs.appendFile('pwm.txt', `\n${input}`, () => console.log(`PWM: ${input}`) )
  }

  async function levelGrabar () {
    await fs.unlink('distance.txt', () => console.log(`Distance: ${output}`))
    await fs.unlink('pwm.txt', () => console.log(`PWM: ${input}`))
    for (let k = 0; k < 5000; k++) {
      await levelGrabarOne()
      await delay(25)
    }
  }

  async function levelSavingData () {
    input = 0
    await pwmPump(input)

    levelGrabar()

    await delay(5000)

    input = 255
    await pwmPump(input)
    await delay(10000)

    input = 0
    await pwmPump(input)
    await delay(5000)
    input = 255
    await pwmPump(input)
    await delay(10000)

    input = 0
    await pwmPump(input)
    await delay(5000)
    input = 255
    await pwmPump(input)
    await delay(10000)

    input = 0
    await pwmPump(input)
    await delay(5000)
    input = 255
    await pwmPump(input)
    await delay(10000)

    input = 0
    await pwmPump(input)
    await delay(5000)
    input = 255
    await pwmPump(input)
    await delay(10000)

    input = 0
    await pwmPump(input)
    await delay(5000)
    input = 255
    await pwmPump(input)
    await delay(10000)

    input = 0
    await pwmPump(input)
    await delay(5000)
    input = 255
    await pwmPump(input)
    await delay(10000)

    input = 0
    await pwmPump(input)
    await delay(5000)
    input = 255
    await pwmPump(input)
    await delay(10000)

    input = 0
    await pwmPump(input)
    await delay(5000)
    input = 255
    await pwmPump(input)
    await delay(10000)

    input = 0
    await pwmPump(input)
    await delay(5000)
    input = 255
    await pwmPump(input)
    await delay(10000)

    input = 0
    await pwmPump(input)
  }

  // CONTROLLING
  let pi0  = pi1  = 0
  let err0 = err1 = 0
  async function levelPidController (sp) {
    err1     = err0
    err0 = sp - output
    let pi0  = pi1 + 15.63 * err0 - 15.63 * err1
    pi1      = pi0
    console.log("pi0  :  " + pi0)
    console.log("err0 :  " + err0)
    await pwmPump(pi0 * 5)
  }

  await pwmPump(0)

  // ======= Lux Control =======
  let luxSetpoint = valueLux0

  board.repl.inject({
    relay : relay,
    temp : temp,
    relayTemp : relayTemp,
    pwmFan : pwmFan,
    tempSavingData : tempSavingData,
    pidController : pidController
    motor : motor,
    pwmPump : pwmPump,
    levelSavingData : levelSavingData
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

