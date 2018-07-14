<template>
  <div>
    <nav class="navbar">
      <div class="navbar-brand">
        <div class="navbar-item">
          <img src="images/leaf.png" alt="Some Alt" width="112" height="28">
        </div>
      </div>
    </nav>
    <div class="columns">
      <div class="column has-text-centered">
        <top
          v-for="agent in agents"
          :uuid="agent.uuid"
          :key="agent.uuid">
        </top>
      </div>
      <div v-on:click="toggleControll" class="column has-text-centered">
        <span v-if="Automatic">Automatic mode</span>
        <span v-else>Manual mode</span>
      </div>
      <div v-on:click="toggleShowMetrics" class="column has-text-centered">Toggle charts</div>
    </div>
    <div class="">
      <agent
        :showMetrics="showMetrics"
        :automatic="automatic"
        v-for="agent in agents"
        :uuid="agent.uuid"
        :key="agent.uuid"
        :socket="socket">
      </agent>
      <p v-if="error">{{error}}</p>
    </div>
  </div>
</template>

<script>
const request = require('request-promise-native')
const io      = require('socket.io-client')
const socket  = io()

module.exports = {
  data () {
    return {
      agents: [],
      error: null,
      automatic: false,
      showMetrics: false,
      socket
    }
  },

  mounted () {
    this.initialize()
  },

  methods: {
    async initialize () {
      const options = {
        method: 'GET',
        url: 'http://localhost:8080/agents',
        json: true
      }

      let result
      try {
        result = await request(options)
      } catch (e) {
        this.error = e.error.error
        return
      }

      this.agents = result

      socket.on('agent/connected', payload => {
        const { uuid } = payload.agent
        const existing = this.agents.find(a => a.uuid === uuid)
        if (!existing) {
          this.agents.push(payload.agent)
        }
      })
    },

    toggleControll() {
      this.automatic = this.automatic ? false : true
    },
    toggleShowMetrics() {
      this.showMetrics = this.showMetrics ? false : true
    }
  }
}
</script>
