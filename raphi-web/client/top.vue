<template>
  <div>
    <div class="is-size-1 has-text-weight-bold">{{name}} ID {{pid}}</div>
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
        url: `http://192.168.1.8:8080/agent/${uuid}`,
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
