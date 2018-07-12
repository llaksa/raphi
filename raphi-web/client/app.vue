<template>
  <div>
    <top
      v-for="agent in agents"
      :uuid="agent.uuid"
      :key="agent.uuid">
    </top>
    <div class="black-text center-align">
      <h5 v-if="automatic" v-on:click="toggleControll" class="deep-orange lighten-4">Modo automático</h5>
      <h5 v-else v-on:click="toggleControll" class="deep-orange lighten-4">Modo manual</h5>
    </div>
    <div class="container">
      <agent
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
    }
  }
}
</script>
