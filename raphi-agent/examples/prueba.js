const RaphiAgent = require('../')

const agent = new RaphiAgent({
  name: 'Lechuga',
  username: 'Irvin',
  interval: 2000
})

agent.addMetric('Temperatura-aire', () => {
  return Math.random() * 100
})

agent.addMetric('Nivel-tanque', () => {
  return Math.random() * 100
})

agent.addMetric('Intensidad-Luz', () => {
  return Math.random() * 100
})

agent.addMetric('Temperatura-agua', () => {
  return Math.random() * 100
})

agent.addMetric('CO', () => {
  return Math.random() * 100
})

agent.addMetric('Aire-fresco', () => {
  return Math.random() * 100
})

agent.addMetric('Agua-fresca', () => {
  return Math.random() * 100
})

agent.addMetric('Aire-circulante', () => {
  return Math.random() * 100
})

agent.addMetric('Agua-circulante', () => {
  return Math.random() * 100
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
