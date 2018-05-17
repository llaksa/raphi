var five = require("johnny-five");
var PlatziverseAgent = require("platziverse-agent")

var agent = new PlatziverseAgent({
  name: 'Arduduino',
  username: 'El merome',
  interval: 1000
})

five.Board().on("ready", function() {
  var temperature = new five.Thermometer({
    controller: "LM35",
    pin: "A0"
  });


  temperature.on("change", function() {
    agent.addMetric('temperature', () => { return this.celsius })
    console.log(this.celsius + "°C", this.fahrenheit + "°F");
  });

  agent.connect()
});
