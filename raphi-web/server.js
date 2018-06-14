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
        usrFshAir0 = state
        break
      case 'fw':
        usrFshWater0 = state
        break
      case 'ra':
        usrRndAir0 = state
        break
      case 'rw':
        usrRndWater0 = state
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

let airTempIn
let airTempOut
let tnkLevelOut
let tnkLevelIn
let waterTempOut
let coOut
let luxOut

let usrFshAir0 = true
let usrFshAir1 = true
let usrFshWater0 = false
let usrFshWater1 = false
let usrRndAir0 = false
let usrRndAir1 = false
let usrRndWater0 = false
let usrRndWater1 = false
let usrAirTemp0 = 22
let usrTnkLevel0 = 10
let usrValLux0 = 0
let usrValLux1 = 0

let luxSp = 0
let airTempSp = 22
let tnkLevelSp = 10

board.on('ready', async () => {

  // ======= Fresh Air =======
  const fshAir_relay = new five.Relay({
    pin: 7,
    type: "NC"
  })

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

  // ======= Fresh Water =======
  const fshWater_relay = new five.Relay({
    pin: 8,
    type: "NC"
  })

  setInterval(() => {
    if (usrFshWater0 != usrFshWater1) {
      if (usrFshWater0) {
        fshWater_relay.on()
        usrFshWater1 = usrFshWater0
      } else {
        fshWater_relay.off()
        usrFshWater1 = usrFshWater0
      }
    }
  }, 300)

  // ======= Round Air =======
  const rndAir_relay = new five.Relay({
    pin: 12,
    type: "NC"
  })

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

  // ======= Round Water =======
  const rndWater_relay = new five.Relay({
    pin: 13,
    type: "NC"
  })

  setInterval(() => {
    if (usrRndWater0 != usrRndWater1) {
      if (usrRndWater0) {
        rndWater_relay.on()
        usrRndWater1 = usrRndWater0
      } else {
        rndWater_relay.off()
        usrRndWater1 = usrRndWater0
      }
    }
  }, 300)

  /*
  // ======= Air Temperature =======

  // Analog Pin 5 As Digital
  new five.Pin({
    pin: 5,
    type: "digital"
  })

  const airTemp_relay = new five.Relay({
    pin: 5,
    type: "NO"
  })

  const temperature = new five.Thermometer({
    controller: "LM35",
    pin: "A0",
    freq: 25
  })

  let airTemp1 = 0
  temperature.on("data", () => {
    let airTemp0 = this.celsius * 0.0609 + airTemp1 * 0.9391
    airTempOut = airTemp0
    //output = Math.round(y0)
    //console.log("temp: " + output)
    //console.log(this.celsius)
    airTemp1 = airTemp0
    airTempPidController(airTempSp)
  })

  board.pinMode(9, five.Pin.PWM)
  async function pwmFan (x) {
    if (x < 90) {
      airTemp_relay.close()
    } else if (x > 255) {
      airTemp_relay.open()
      board.analogWrite(9, 255)
    } else {
      airTemp_relay.open()
      board.analogWrite(9, x)
    }
  }

  // ======= Saving Air Temperature Data =======
  
  async function airTempGrabarOne () {
      await fs.appendFile('airTemperature.txt', `\n${airTempOut}`, () => console.log(`AirTemperature: ${airTempOut}`))
      await fs.appendFile('pwm.txt', `\n${airTempIn}`, () => console.log(`PWM: ${airTempIn}`) )
  }

  async function airTempGrabar () {
    await fs.unlink('airTemperature.txt', () => console.log(`airTemperature: ${airTempOut}`))
    await fs.unlink('pwm.txt', () => console.log(`PWM: ${airTempIn}`))
    for (let k = 0; k < 5000; k++) {
      await airTempGrabarOne()
      await delay(25)
    }
  }

  async function airTempSavingData () {
    airTempIn = 0
    await pwmFan(airTempIn)

    airTempGrabar()

    await delay(15000)

    airTempIn = 255
    await pwmFan(airTempIn)

    await delay(112000)

    airTempIn = 0
    await pwmFan(airTempIn)
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
    console.log("pi0  :  " + airTemp_pi0)
    console.log("err0 :  " + airTemp_err0)
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

  proximity.on("data", async () => {
    let tnkLevel0 = this.cm * 0.0609 + tnkLevel1 * 0.9391
    tnkLevelOut = 22 - tnkLevel0
    //console.log(output)
    tnkLevel1 = tnkLevel0
    await tnkLevelPidController(tnkLevelSp)
  })

  // ======= Saving Distance Data =======
  async function tnkLevelGrabarOne () {
    await fs.appendFile('distance.txt', `\n${tnkLevelOut}`, () => console.log(`Distance: ${tnkLevelOut}`))
    await fs.appendFile('pwm.txt', `\n${tnkLevelIn}`, () => console.log(`PWM: ${tnkLevelIn}`) )
  }

  async function tnkLevelGrabar () {
    await fs.unlink('distance.txt', () => console.log(`Distance: ${tnkLevelOut}`))
    await fs.unlink('pwm.txt', () => console.log(`PWM: ${tnkLevelIn}`))
    for (let k = 0; k < 5000; k++) {
      await tnkLevelGrabarOne()
      await delay(25)
    }
  }

  async function tnkLevelSavingData () {
    tnkLevelIn = 0
    await pwmPump(tnkLevelIn)

    tnkLevelGrabar()

    await delay(5000)

    tnkLevelIn = 255
    await pwmPump(tnkLevelIn)
    await delay(10000)

    tnkLevelIn = 0
    await pwmPump(tnkLevelIn)
    await delay(5000)
    tnkLevelIn = 255
    await pwmPump(tnkLevelIn)
    await delay(10000)

    tnkLevelIn = 0
    await pwmPump(tnkLevelIn)
    await delay(5000)
    tnkLevelIn = 255
    await pwmPump(tnkLevelIn)
    await delay(10000)

    tnkLevelIn = 0
    await pwmPump(tnkLevelIn)
    await delay(5000)
    tnkLevelIn = 255
    await pwmPump(tnkLevelIn)
    await delay(10000)

    tnkLevelIn = 0
    await pwmPump(tnkLevelIn)
    await delay(5000)
    tnkLevelIn = 255
    await pwmPump(tnkLevelIn)
    await delay(10000)

    tnkLevelIn = 0
    await pwmPump(tnkLevelIn)
    await delay(5000)
    tnkLevelIn = 255
    await pwmPump(tnkLevelIn)
    await delay(10000)

    tnkLevelIn = 0
    await pwmPump(tnkLevelIn)
    await delay(5000)
    tnkLevelIn = 255
    await pwmPump(tnkLevelIn)
    await delay(10000)

    tnkLevelIn = 0
    await pwmPump(tnkLevelIn)
    await delay(5000)
    tnkLevelIn = 255
    await pwmPump(tnkLevelIn)
    await delay(10000)

    tnkLevelIn = 0
    await pwmPump(tnkLevelIn)
    await delay(5000)
    tnkLevelIn = 255
    await pwmPump(tnkLevelIn)
    await delay(10000)

    tnkLevelIn = 0
    await pwmPump(tnkLevelIn)
    await delay(5000)
    tnkLevelIn = 255
    await pwmPump(tnkLevelIn)
    await delay(10000)

    tnkLevelIn = 0
    await pwmPump(tnkLevelIn)
  }

  // ======= Tank Level Controller =======

  // Analog Pin 10 As Digital
  new five.Pin({
    pin: 10,
    type: "digital"
  })

  const motor = new five.Motor(
    { pins: { dir: 10, pwm: 9 }, invertPWM: true }
  )

  async function pwmPump (x) {
    if (x < 200 || tnkLevel_err0 < 0) {
      motor.fwd(200)
    } else if (x > 255) {
      motor.fwd(255)
    } else {
      motor.fwd(200)
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
    console.log("pi0  :  " + tnkLevel_pi0)
    console.log("err0 :  " + tnkLevel_err0)
    await pwmPump(tnkLevel_pi0 * 5)
  }

  await pwmPump(0)

  // ======= Lux =======
  const led = new five.Led(3)

  async function luxController(Sp) {
    led.brightness(Sp)
  }

  setInterval(() => {
    if (usrValLux0 != usrValLux1) {
      luxController(luxSp)
    }
  }, 300)

  const light = new five.Light({
    controller: "BH1750",
  })

  light.on("data", function() {
    luxOut = light.lux
    console.log("Lux: ", luxOut)
  })

  // INJECTS

  board.repl.inject({
    airTemp_relay : airTemp_relay,
    pwmFan : pwmFan,
    pwmPump : pwmPump,
    airTempSavingData : airTempSavingData,
    tnkLevelSavingData : tnkLevelSavingData,
    airTempPidController : airTempPidController,
    tnkLevelPidController : tnkLevelPidController,
    motor : motor,
    luxController : luxController
  })


  // ======= CO Just Sensing =======
  const coSensor = new five.Sensor("A1")

  coSensor.on("change", () => {
    coOut = coSensor.scaleTo(0, 10)
    console.log('co : ' + coOut)
  })
  */


  // ======= Coommon Functions =======
  async function delay (time) {
    return new Promise(resolve => {
      setTimeout(resolve, time)
    })
  }

})

/*
const board2 = new five.Board({
  port: "/dev/ttyUSB0"
})

board2.on("ready", async function() {
// ======= Water Temperature Just Sensing =======

  // This requires OneWire support using the ConfigurableFirmata
  let waterTemp = new five.Thermometer({
    controller: "DS18B20",
    pin: 2
  })

  waterTemp.on("change", function() {
    waterTempOut = this.celsius
    console.log(waterTempOut + "°C");
    // console.log("0x" + this.address.toString(16));
  })
})
*/

// =============================================================================


// ======= Raphi Agent Zone ====================================================

const agent2 = new RaphiAgent({
  name: 'Lechuga',
  username: 'Irvin',
  interval: 2000
})

agent2.addMetric('Temperatura-aire', () => {
  return Math.random() * 100
  //return airTempOut
})

agent2.addMetric('Nivel-tanque', () => {
  return Math.random() * 100
  //return tnkLevelOut
})

agent2.addMetric('Intensidad-Luz', () => {
  return Math.random() * 100
  //return luxOut
})

agent2.addMetric('Temperatura-agua', () => {
  return Math.random() * 100
  //return waterTempOut
})

agent2.addMetric('CO', () => {
  return Math.random() * 100
  //return coOut
})

agent2.addMetric('Aire-fresco', () => {
  //return Math.random() * 100
  return usrFshAir0
})

agent2.addMetric('Agua-fresca', () => {
  //return Math.random() * 100
  return usrFshWater0
})

agent2.addMetric('Aire-circulante', () => {
  //return Math.random() * 100
  return usrRndAir0
})

agent2.addMetric('Agua-circulante', () => {
  //return Math.random() * 100
  return usrRndWater0
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
  console.log(payload)
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
