'use strict'

const five = require("johnny-five");
const PlatziverseAgent = require('platziverse-agent')

const board = new five.Board();

const agent = new PlatziverseAgent({
  name: 'arduino',
  username: 'irvin',
  interval: 5000,
  mqtt: {
    host: 'mqtt://localhost'
  }
})

board.on("ready", function() {
  var temp = 0
  console.log(temp)
  const sensor = new five.Thermometer({
    controller: 'LM35',
    pin: 'A0'
  })

  agent.addMetric('temperature', () => {
    console.log(22222222)
    return temp
  })

  sensor.on('change', () => {
    console.log(this.celsius)
    temp = this.celsius
  })

  agent.connect()
})

