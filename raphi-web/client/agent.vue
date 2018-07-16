<template>
  <div class="columns is-multiline">
    <metric
      :showMetrics="showMetrics"
      :automatic="automatic"
      :uuid="uuid"
      :socket="socket"
      v-for="metric in metrics"
      v-bind:type="metric.type"
      v-bind:key="metric.type"
    ></metric>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
const request = require('request-promise-native')

module.exports = {
  props: [ 'uuid', 'socket', 'automatic', 'showMetrics' ],

  data() {
    return {
      name: null,
      hostname: null,
      connected: false,
      pid: null,
      error: null,
      metrics: []
    }
  },

  mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      this.$box = document.querySelector('.box')

      const { uuid } = this

      const options = {
        method: 'GET',
        url: `http://localhost:8080/agent/${uuid}`,
        json: true
      }

      let agent
      try {
        agent = await request(options)
      } catch (e) {
        this.error = e.error.error
        return
      }

      this.name = agent.name
      this.hostname = agent.hostname
      this.connected = agent.connected
      this.pid = agent.pid

      this.loadMetrics()
    },

    async loadMetrics () {
      const { uuid } = this

      const options = {
        method: 'GET',
        url: `http://localhost:8080/metrics/${uuid}`,
        json: true
      }

      let metrics
      try {
        metrics = await request(options)
      } catch (e) {
        this.error = e.error.error
        return
      }

      this.metrics = metrics

      this.startRealtime()
    },

    startRealtime () {
      const { uuid, socket } = this

      socket.on('agent/disconnected', payload => {
        if (payload.agent.uuid === uuid) {
          this.connected = false
        }
      })
    }
  }
}
</script>
