<template>
  <div>
    <div class="col s6">
      <h4 class="center-align">Cultivo ID: {{pid}} ({{name}})</h4>
    </div>
    <div class="col s2">
      <h5 href="weather.html" class="btn-small">Clima</h5>
    </div>
    <div class="col s2">
      <h5 href="image.html" class="btn-small">Imagen</h5>
    </div>
  </div>
</template>

<script>
const request = require('request-promise-native')

module.exports = {
  props: [ 'uuid' ],

  data() {
    return {
      name: null,
      pid: null,
      error: null,
    }
  },

  mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
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
      this.pid = agent.pid
    }
  }
}
</script>
