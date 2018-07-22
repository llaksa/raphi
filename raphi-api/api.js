'use strict'

const debug          = require('debug')('raphi:api:routes')
const express        = require('express')
const asyncify       = require('express-asyncify')
const expressAuth    = require('express-jwt')
const guard          = require('express-jwt-permissions')()
const myConfigs      = require('../common/config')(debug)
const databaseModule = require('raphi-db')

const api = asyncify(express.Router())

const { auth, db } = myConfigs

/*
const { auth, db } = {
  db: {
    database: process.env.DB_NAME || 'raphi_database',
    username: process.env.DB_USER || 'raphi_role',
    password: process.env.DB_PASS || 'raphi_password',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => callback(s)
  },
  auth: {
    secret: process.env.SECRET || 'raphi_secret'
  }
}
*/

let services, Agent, Metric

api.use('*', async (req, res, next) => {
  if (!services) {
    debug('Connecting to database')
    try {
      services = await databaseModule(db)
    } catch (e) {
      return next(e)
    }

    Agent  = services.Agent
    Metric = services.Metric
  }
  next()
})

api.get('/agents', expressAuth(auth), async (req, res, next) => {
  debug('A request has come to /agents')

  const { user } = req

  if (!user || !user.username) {
    return next(new Error('Not authorized'))
  }

  let agents = []
  try {
    if (user.admin) {
      agents = await Agent.findConnected()
    } else {
      agents = await Agent.findByUsername(user.username)
    }
  } catch (e) {
    return next(e)
  }

  res.send(agents)
})

api.get('/agent/:uuid', async (req, res, next) => {
  const { uuid } = req.params

  debug(`request to /agent/${uuid}`)

  let agent
  try {
    agent = await Agent.findByUuid(uuid)
  } catch (e) {
    return next(e)
  }

  if (!agent) {
    return next(new Error(`Agent not found with uuid ${uuid}`))
  }

  res.send(agent)
})

api.get('/metrics/:uuid', expressAuth(auth), guard.check(['metrics:read']), async (req, res, next) => {
  const { uuid } = req.params

  debug(`request to /metrics/${uuid}`)

  let metrics = []
  try {
    metrics = await Metric.findByAgentUuid(uuid)
  } catch (e) {
    return next(e)
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uuid}`))
  }

  res.send(metrics)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params

  debug(`request to /metrics/${uuid}/${type}`)

  let metrics = []
  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid)
  } catch (e) {
    return next(e)
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics (${type}) not found for agent with uuid ${uuid}`))
  }

  res.send(metrics)
})

module.exports = api
