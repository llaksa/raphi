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
      <div class="column has-text-centered has-text-success">
        <top
          v-for="agent in agents"
          :uuid="agent.uuid"
          :key="agent.uuid">
        </top>
      </div>
      <div class="column has-text-centered">
        <div class="level-item has-text-centered">
          <div>
            <p v-on:click="toggleControll" class="button is-info heading">toggle mode</p>
            <p class="tag is-medium is-warning" v-if="automatic">Automatic</p>
            <p class="tag is-medium is-warning" v-else>Manual</p>
          </div>
        </div>
      </div>
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
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
        </p>
      </div>
    </footer>
    
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
