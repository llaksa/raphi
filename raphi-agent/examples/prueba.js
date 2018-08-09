const RaphiAgent = require('../')

const agent = new RaphiAgent({
  name: 'Lettuce',
  username: 'Irvin',
  interval: 2000
})

agent.addMetric('AirTemperature', () => {
  return Math.random() * 100
})

agent.addMetric('TankLevel', () => {
  return Math.random() * 100
})

agent.addMetric('LightIntensity', () => {
  return Math.random() * 100
})

agent.addMetric('WaterTemperature', () => {
  return Math.random() * 100
})

agent.addMetric('OxygenMonoxide', () => {
  return Math.random() * 100
})

agent.addMetric('FreshAir', () => {
  return true
})

agent.addMetric('FreshNutriSol', () => {
  return true
})

agent.addMetric('AirCirculation', () => {
  return false
})

agent.addMetric('NutriSolCirculation', () => {
  return false
})

agent.connect()

// This agent only
agent.on('connected', handler)
agent.on('disconnected', handler)
agent.on('message', handler)

// Other Agents
agent.on('agent/connected', handler)
agent.on('agent/disconnected', handler)
agent.on('agent/message', handler)

function handler (payload) {
  console.log(payload)
}
