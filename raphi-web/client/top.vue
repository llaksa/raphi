<template>
    <nav>
      <div class="nav-wrapper">
        <div class="brand-logo">Cultivo: <span>{{name}} ({{pid}})</span></div>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li>
            <button v-on:click="toggleControllMode">Control:
              <span v-if="automatic">Automatic</span>
              <span v-else>Manual</span>
          </button></li>
          <li><a href="weather.html">Clima</a></li>
          <li><a href="image.html">Imagen</a></li>
        </ul>
      </div>
    </nav>
</template>

<script>
const request = require('request-promise-native')

module.exports = {
  props: [ 'uuid' ],

  data() {
    return {
      name: null,
      pid: null,
      automatic: true,
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
    },

    toggleControllMode() {
      this.automatic = this.automatic ? false : true
    }
  }
}
</script>
