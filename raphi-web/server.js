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

// ==================== JOHNNY FIVE ZONE ======================================:

// Relays Digital Pins  : 5 (PWM Pin 5 used as digital!), 4, 8, 12, 13
// Sensors Analog Pins  : A0, A1, A4, A5
// Sensors Digital Pins : 2, 7, 10 (PWM Pin 10 used as digital!)
// PWM Pins             : 9

const five  = require('johnny-five')
const board = new five.Board({
  port: "/dev/ttyACM0"
})

let airTempOut = 0
let tnkLevelOut = 0
let nutriSolTempOut = 0
let coOut = 0
let luxOut = 0

let usrFshAir0 = false
let usrFshAir1 = false
let usrFshNutriSol0 = false
let usrFshNutriSol1 = false
let usrRndAir0 = false
let usrRndAir1 = false
let usrRndNutriSol0 = false
let usrRndNutriSol1 = false
let usrAirTemp0 = 22
let usrTnkLevel0 = 10
let usrValLux0 = 0
let usrValLux1 = 0

let luxSp = 0
let airTempSp = 22
let tnkLevelSp = 10

board.on('ready', async function () {

  // ======= Fresh Air =======
  const fshAir_relay = new five.Relay({
    pin: 7,
    type: "NC"
  })

  fshAir_relay.off()
  setInterval(() => {
    if (usrFshAir0 != usrFshAir1) {
      if (usrFshAir0) {
        fshAir_relay.on()
        usrFshAir1 = usrFshAir0
      } else {
        fshAir_relay.off()
        usrFshAir1= usrFshAir0
      }
    }
  }, 300)

  // ======= Fresh Nutritive Solution =======
  new five.Pin({
    pin: 10,
    type: "digital"
  })

  const fshNutriSol_relay = new five.Relay({
    pin: 10,
    type: "NC"
  })

  fshNutriSol_relay.off()
  setInterval(() => {
    if (usrFshNutriSol0 != usrFshNutriSol1) {
      if (usrFshNutriSol0) {
        fshNutriSol_relay.on()
        usrFshNutriSol1 = usrFshNutriSol0
      } else {
        fshNutriSol_relay.off()
        usrFshNutriSol1 = usrFshNutriSol0
      }
    }
  }, 300)

  // ======= Round Air =======
  const rndAir_relay = new five.Relay({
    pin: 12,
    type: "NC"
  })

  rndAir_relay.off()
  setInterval(() => {
    if (usrRndAir0 != usrRndAir1) {
      if (usrRndAir0) {
        rndAir_relay.on()
        usrRndAir1 = usrRndAir0
      } else {
        rndAir_relay.off()
        usrRndAir1 = usrRndAir0
      }
    }
  }, 300)

  // ======= Round Nutritive Solution  =======
  const rndNutriSol_relay = new five.Relay({
    pin: 13,
    type: "NC"
  })

  rndNutriSol_relay.off()
  setInterval(() => {
    if (usrRndNutriSol0 != usrRndNutriSol1) {
      if (usrRndNutriSol0) {
        rndNutriSol_relay.on()
        usrRndNutriSol1 = usrRndNutriSol0
      } else {
        rndNutriSol_relay.off()
        usrRndNutriSol1 = usrRndNutriSol0
      }
    }
  }, 300)

  // ======= Lux =======
  var led = new five.Led(3)

  async function luxController(Sp) {
    led.brightness( Math.round(Sp) )
  }

  setInterval(async () => {
    if (usrValLux0 != usrValLux1) {
      await luxController(luxSp)
    }
  }, 300)

  /*
  const light = new five.Light({
    controller: "BH1750",
  })

  light.on("data", function() {
    luxOut = light.lux
    console.log("Lux: ", luxOut)
  })
  */

  // ======= CO Just Sensing =======
  const coSensor = new five.Sensor("A1")

  coSensor.on("change", () => {
    coOut = 10.32 * (coSensor.scaleTo(0, 1023)^(-0.64))
  })

  // ======= Nutritive Solution Temperature Just Sensing =======
  const nutriSolTemp = new five.Thermometer({
    controller: "LM35",
    pin: "A5",
    freq: 25
  })

  let y1 = 0
  nutriSolTemp.on("data", function () {
    let y0 = this.celsius * 0.0609 + y1 * 0.9391
    nutriSolTempOut = y0
    y1 = y0
  })

  // ======= Air Temperature =======

  // Analog Pin 5 As Digital
  new five.Pin({
    pin: 4,
    type: "digital"
  })

  const airTemp_relay = new five.Relay({
    pin: 4,
    type: "NO"
  })

  const airTemperature = new five.Thermometer({
    controller: "LM35",
    pin: "A0",
    freq: 25
  })

  let airTemp1 = 0
  airTemperature.on("data", function () {
    let airTemp0 = this.celsius * 0.0609 + airTemp1 * 0.9391
    airTempOut = airTemp0
    //output = Math.round(y0)
    //console.log("temp: " + airTempOut)
    //console.log(this.celsius)
    airTemp1 = airTemp0
    airTempPidController(airTempSp)
  })

  board.pinMode(5, five.Pin.PWM)
  async function pwmFan (x) {
    if (x < 90) {
      airTemp_relay.close()
    } else if (x > 255) {
      airTemp_relay.open()
      board.analogWrite(5, 255)
    } else {
      airTemp_relay.open()
      board.analogWrite(5, x)
    }
  }

  let airTemp_pi0 = 0
  let airTemp_pi1  = 0
  let airTemp_err0 = 0
  let airTemp_err1 = 0
  async function airTempPidController (sp) {
    airTemp_err1     = airTemp_err0
    airTemp_err0 = airTempOut - sp
    let airTemp_pi0  = airTemp_pi1 + 52.1 * airTemp_err0 - 52.09 * airTemp_err1
    airTemp_pi1      = airTemp_pi0
    //console.log("pi0  :  " + airTemp_pi0)
    //console.log("err0 :  " + airTemp_err0)
    await pwmFan(airTemp_pi0)
  }

  await pwmFan(0)

  // ======= Tank Level =======

  // Analog Pin 5 As Digital
  new five.Pin({
    pin: 6,
    type: "digital"
  })

  const proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 6
  })

  let tnkLevel1 = 0

  proximity.on("data", async function () {
    let tnkLevel0 = this.cm * 0.0609 + tnkLevel1 * 0.9391
    tnkLevelOut = 22 - tnkLevel0
    //console.log(tnkLevelOut)
    tnkLevel1 = tnkLevel0
    await tnkLevelPidController(tnkLevelSp)
  })

  // ======= Tank Level Controller =======

  // Analog Pin 10 As Digital
  const motor = new five.Motor({
    pins: { dir: 8, pwm: 9 }, invertPWM: true
  })

  async function pwmPump (x) {
    if (x < 200 || tnkLevel_err0 < 0) {
      await motor.stop(0)
    } else if (x > 255) {
      await motor.stop(0)
      await motor.fwd(255)
    } else {
      await motor.stop(0)
      await motor.fwd(x)
    }
  }

  let tnkLevel_pi0 = 0
  let tnkLevel_pi1  = 0
  let tnkLevel_err0 = 0
  let tnkLevel_err1 = 0
  async function tnkLevelPidController (sp) {
    tnkLevel_err1     = tnkLevel_err0
    tnkLevel_err0 = sp - tnkLevelOut
    let tnkLevel_pi0  = tnkLevel_pi1 + 15.63 * tnkLevel_err0 - 15.63 * tnkLevel_err1
    tnkLevel_pi1      = tnkLevel_pi0
    //console.log("pi0  :  " + tnkLevel_pi0)
    //console.log("err0 :  " + tnkLevel_err0)
    await pwmPump(tnkLevel_pi0 * 5)
  }

  await pwmPump(0)

  // ======= Coommon Functions =======
  async function delay (time) {
    return new Promise(resolve => {
      setTimeout(resolve, time)
    })
  }

  // ====== REPL ======
  board.repl.inject({
    pwmFan : pwmFan,
    pwmPump : pwmPump,
    relay : airTemp_relay,
    motor : motor
  })

})

// =============================================================================


// ======= Raphi Agent Zone ====================================================

const agent2 = new RaphiAgent({
  name: 'Lettuce',
  username: 'Irvin',
  interval: 2000
})

agent2.addMetric('AirTemperature', () => {
  //return Math.random() * 100
  return airTempOut
})

agent2.addMetric('TankLevel', () => {
  //return Math.random() * 100
  return tnkLevelOut
})

agent2.addMetric('LightIntensity', () => {
  //return Math.random() * 100
  //return luxOut
  return usrValLux0
})

agent2.addMetric('NutriSolTemperature', () => {
  //return Math.random() * 100
  return nutriSolTempOut
})

agent2.addMetric('OxygenMonoxide', () => {
  //return Math.random() * 100
  return coOut
})

agent2.addMetric('FreshAir', () => {
  //return Math.random() * 100
  return usrFshAir0
})

agent2.addMetric('FreshNutriSol', () => {
  //return Math.random() * 100
  return usrFshNutriSol0
})

agent2.addMetric('AirCirculation', () => {
  //return Math.random() * 100
  return usrRndAir0
})

agent2.addMetric('NutriSolCirculation', () => {
  //return Math.random() * 100
  return usrRndNutriSol0
})

agent2.connect()

// This agent only
agent2.on('connected', handler)
agent2.on('disconnected', handler)
agent2.on('message', handler)

// Other Agents
agent2.on('agent/connected', handler)
agent2.on('agent/disconnected', handler)
agent2.on('agent/message', handler)

function handler (payload) {
  //console.log(payload)
}

// =============================================================================

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
