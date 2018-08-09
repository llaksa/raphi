'use strict'

const debug        = require('debug')('raphi:agent')
const os           = require('os')
const util         = require('util') // se llama porq necesitamos usar promisify
const mqtt         = require('mqtt')
const defaults     = require('defaults')
const uuid         = require('uuid')
const EventEmitter = require('events') // paquete del core de nodejs

const { parsePayload } = require('./utils')

const options = {
  name: 'untitled',
  username: 'myadmin',
  interval: 5000, // cada cuánto tiempo emitir mensajes
  mqtt: {
    host: 'mqtt://localhost'
  }
}

// con esta clase, los objetos podrán implementar listeners (" agent.on("some-event", callback)) y emmitters (agent.emit("some-event", data)) de eventos

class RaphiAgent extends EventEmitter { // el agente raphi-agent se extiende de la CLASE eventEmitter
  constructor (opts) {
    super()

    this._options = defaults(opts, options) // referencia interna de las opciones
    this._started = false // referencia del timer para saber si inicializó o no
    this._timer   = null // referencia del timer inicializada en nulo
    this._client  = null // referencia al cliente MQTT inicializada en null
    this._agentId = null // referencia para el agentId
    this._metrics = new Map() // inicializar como un Mapa
  }

  addMetric (type, fn) {
    this._metrics.set(type, fn) // agrega objetos al Mapa metrics
  }

  removeMetric (type) {
    this._metrics.delete(type) // borra objetos del Mapa metrics
  }

  connect () {
    if (!this._started) { // si todavía no inicializó entonces:
      const opts = this._options // guardar las opciones en opts
      this._client = mqtt.connect(opts.mqtt.host) // se crea la referencia al cliente MQTT
      this._started = true

      this._client.subscribe('agent/message') // suscripción del cliente MQTT al evento de "agent/message" del servidor MQTT para escucharlo
      this._client.subscribe('agent/connected') // suscripción del cliente MQTT al evento de "agent/connected" del servidor MQTT para escucharlo
      this._client.subscribe('agent/disconnected') // suscripción del cliente MQTT al evento de "agent/disconnected" del servidor mqtt para escucharlo
      // el objetivo de estas suscripciones es que el servidor MQTT distribuya el objeto agente de un cliente a todos los demás

      this._client.on('connect', () => { // luego de que el cliente MQTT se conecto al servidor MQTT exitosamente ("connect" no es un "evento" ni del servidor ni del cliente, es un evento que avisa q se logró la conexión buena:
        this._agentId = uuid.v4() // se asigna un id al presente agente (cliente MQTT)

        this.emit('connected', this._agentId) // este es un evento del cliente MQTT PARA SÍ MISMO! Se está creando un emisor de evento "connected" cuando el cliente se cnecta al servidor, esto es para enviar el dato "this._agentId" cuando se implemente un objeto de esta clase con agent.on"connected", cb) (y se ejecute cb(this_agentId)

        this._timer = setInterval(async () => {
          if (this._metrics.size > 0) { // transmitir cuerpo de metricas y agente solo si hay más métricas
            // inicialización del cuerpo de los objetos agent y metrics!!!:
            let message = {
              agent: {
                uuid: this._agentId,
                username: opts.username,
                name: opts.name,
                hostname: os.hostname() || 'localhost',
                pid: process.pid
              },
              metrics: [],
              timestamp: new Date().getTime()
            }

            for (let [ metric, fn ] of this._metrics) {
              if (fn.length === 1) { // para hallar el function addity, mediante la propiedad lenght y saber si tiene argumentos; y si tiene solo un argumento es porque es callback
                fn = util.promisify(fn) // se convierte la función síncrona fn a promesa
              }

              message.metrics.push({ // agrega al cuerpo de metricas del mensaje, los tipos y valores
                type: metric,
                value: await Promise.resolve(fn()) // arroja el valor de la función
              })
            }

            debug('Sending', message)

            this._client.publish('agent/message', JSON.stringify(message)) // se publica el topic "agent/message" con el payload q es string, no olvidar"
            this.emit('message', message) // este es un evento del cliente MQTT PARA SÍ MISMO!
          }
        }, opts.interval) // emite el evento "agent/message" cada tiempo según opts.interval!
      })

      this._client.on('message', (topic, payload) => { // responde a cuando el servidor MQTT emite un evento "publish". Evento del servidor hacia los clientes. Es escuchado por este instanciamiento.
        payload = parsePayload(payload) // parsea el payload a un objeto javasscript

        let broadcast = false // para manejar dos sets de mansajes: de sí mismo como del servidor
        switch (topic) {
          case 'agent/connected': // no pasa nada
          case 'agent/disconnected': // no pasa nada
          case 'agent/message': // sí se usa! :P
            // todo evento puede ser escuchado o emitido por este instanciamiento u otros instanciamientos; pero para que este instanciamiento no escuche los eventos "agent/message", "agent/connected", "agent/disconnectes" de SÍ MISMO, se usa el broadcast
            // se hace broadcast si el payload es bueno, contiene info del agente y si el uuid del agente es diferente al id del agente que se acaba de instanciar, broadcast será true
            broadcast = payload && payload.agent && payload.agent.uuid !== this._agentId
            break
        }

        if (broadcast) { // cuando broadcast sea true, se emite el evento "topic" con mensaje "payload", los cuales serán respondidos por el servidor
          this.emit(topic, payload) // estos eventos los escucha este instanciamiento y también para el servidor
        }
      })

      this._client.on('error', () => this.disconnect())
    }
  }

  disconnect () {
    if (this._started) {
      clearInterval(this._timer)
      this._started = false
      this.emit('disconnected', this._agentId) // este es un evento del cliente MQTT PARA SÍ MISMO
      this._client.end() // end() es mpetodo de la librería
    }
  }
}

module.exports = RaphiAgent
