'use strict'

const debug            = require('debug')('raphi:mqtt')
const myConfigs        = require('../common/config')(debug)
const mosca            = require('mosca')
const redis            = require('redis')
const chalk            = require('chalk')
const handleError      = require('../common/error')(chalk)
const databaseModule   = require('raphi-db')
const { parsePayload } = require('./utils')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend
}

const server  = new mosca.Server(settings)
const clients = new Map()
const { db }  = myConfigs

let Agent, Metric

server.on('clientConnected', client => {
  debug(`Client Connected: ${client.id}`)
  clients.set(client.id, null)
})

server.on('clientDisconnected', async (client) => {
  debug(`Client Disconnected: ${client.id}`)
  const agent = clients.get(client.id)

  if (agent) {
    // Mark Agent as Disconnected
    agent.connected = false

    try {
      await Agent.createOrUpdate(agent)
    } catch (e) {
      return handleError.simple(e)
    }

    // Delete Agent from Clients List
    clients.delete(client.id)

    server.publish({
      topic: 'agent/disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })
    debug(`Client (${client.id}) associated to Agent (${agent.uuid}) marked as disconnected`)
  }
})

server.on('published', async (packet, client) => {
  debug(`Received: ${packet.topic}`)

  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`Payload: ${packet.payload}`)
      break
    case 'agent/message':
      debug(`Payload: ${packet.payload}`)

      const payload = parsePayload(packet.payload)

      if (payload) {
        payload.agent.connected = true

        let agent
        try {
          agent = await Agent.createOrUpdate(payload.agent)
        } catch (e) {
          return handleError.simple(e)
        }

        debug(`Agent ${agent.uuid} saved`)

        // Notify Agent is Connected
        if (!clients.get(client.id)) {
          clients.set(client.id, agent)
          server.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          })
        }

        // Store Metrics
        for (let metric of payload.metrics) {
          let m

          try {
            m = await Metric.create(agent.uuid, metric)
          } catch (e) {
            return handleError.simple(e)
          }

          debug(`Metric ${m.id} saved on agent ${agent.uuid}`)
        }
      }
      break
  }
})

server.on('ready', async () => {
  const services = await databaseModule(db).catch(handleError.fatal)

  Agent = services.Agent
  Metric = services.Metric

  console.log(`${chalk.green('[raphi-mqtt]')} server is running`)
})

server.on('error', handleError.fatal)

process.on('uncaughtException', handleError.fatal)
process.on('unhandledRejection', handleError.fatal)
