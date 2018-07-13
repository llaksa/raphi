<template>
  <div>
    <top
      v-for="agent in agents"
      :uuid="agent.uuid"
      :key="agent.uuid">
    </top>
    <div class="black-text center-align row">
      <div v-if="automatic" v-on:click="toggleControll" class="btn cyan black-text col s6">Modo automático</div>
      <div v-else v-on:click="toggleControll" class="btn cyan black-text col s6">Modo manual</div>
      <div v-on:click="toggleShowMetrics" class="btn teal lighten-1 black-text row col s6">Toggle charts</div>
    </div>
    <div class="container">
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
