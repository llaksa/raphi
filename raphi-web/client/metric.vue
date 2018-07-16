<template>
  <div class="column is-one-quarter">
    
    <div v-if="type === 'AirTemperature'" class="card">
      <br/>
      <div class="card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/airTemperature.svg">
        </figure>
      </div>
      <div class="card-content">
        <p class="title is-size-5">
          Air Temperature [C°]
        </p>
        <p class="subtitle">
          {{ rightNowElement }}
        </p>
        <footer v-show="!automatic" class="card-footer">
          <input id="temp" type="number" class="card-footer-item" value="0" />
          <button class="card-footer-item" v-on:click="setValue('temp')" type="submit" name="action">Set</button>
        </footer>
      </div>
      <button v-on:click="classIsActive" class="modal-button">MODAL BUTTON</button>
    </div>
    
    <div v-else-if="type === 'TankLevel'" class="card">
      <br/>
      <div class="card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/tankLevel.svg">
        </figure>
      </div>
      <div class="card-content">
        <p class="title is-size-5">
          Liquid Level [cm]
        </p>
        <p class="subtitle">
          {{ rightNowElement }}
        </p>
        <footer v-show="!automatic" class="card-footer">
          <input id="level" type="number" class="card-footer-item" value="0" />
          <button v-on:click="setValue('level')" class="card-footer-item" type="submit" name="action">Set</button>
        </footer>
      </div>
      <button v-on:click="classIsActive" class="modal-button">MODAL BUTTON</button>
    </div>

    <div v-else-if="type === 'LightIntensity'" class="card">
      <br/>
      <div class="card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/lightIntensity.svg">
        </figure>
      </div>
      <div class="card-content">
        <p class="title is-size-5">
          Light Intensity [lux]
        </p>
        <p class="subtitle">
          {{ rightNowElement }}
        </p>
        <footer v-show="!automatic" class="card-footer">
          <input id="lux" type="number" class="card-footer-item" value="0" />
          <button v-on:click="setValue('lux')" class="card-footer-item" type="submit" name="action">Set</button>
        </footer>
      </div>
      <button v-on:click="classIsActive" class="modal-button">MODAL BUTTON</button>
    </div>

    <div v-else-if="type === 'FreshAir'" class="card">
      <div class="card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/freshAir.svg">
        </figure>
      </div>
      <div class="card-content">
        <p class="title is-size-5">
          Fresh Air
        </p>
        <p class="subtitle">
          {{ rightNowElement }}
        </p>
        <footer class="card-footer">
          <div v-if="state === false" class="card-footer-item">OFF</div>
          <div v-else="state === true" class="card-footer-item">ON</div>
          <button v-show="!automatic" v-on:click="setState('fa')" class="card-footer-item" type="submit" name="action">Toggle</button>
        </footer>
      </div>
      <button v-on:click="classIsActive" class="modal-button">MODAL BUTTON</button>
    </div>
    
    <div class="card" v-else-if="type === 'FreshWater'">
      <br/>
      <div class="card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/freshWater.svg">
        </figure>
      </div>
      <div class="card-content">
        <p class="title is-size-5">
          Fresh Liquid
        </p>
        <p class="subtitle">
          {{ rightNowElement }}
        </p>
        <footer class="card-footer">
          <div v-if="state === false" class="card-footer-item">OFF</div>
          <div v-else="state === true" class="card-footer-item">ON</div>
          <button v-show="!automatic" v-on:click="setState('fw')" class="card-footer-item" type="submit" name="action">Toggle</button>
        </footer>
      </div>
      <button v-on:click="classIsActive" class="modal-button">MODAL BUTTON</button>
    </div>
    
    <div class="card" v-else-if="type === 'AirCirculation'">
      <br/>
      <div class="card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/airCirculation.svg">
        </figure>
      </div>
      <div class="card-content">
        <p class="title is-size-5">
          Air Circulation
        </p>
        <p class="subtitle">
          {{ rightNowElement }}
        </p>
        <footer class="card-footer">
          <div v-if="state === false" class="card-footer-item">OFF</div>
          <div v-else="state === true" class="card-footer-item">ON</div>
          <button v-show="!automatic" v-on:click="setState('ra')" class="card-footer-item" type="submit" name="action">Toggle</button>
        </footer>
      </div>
      <button v-on:click="classIsActive" class="modal-button">MODAL BUTTON</button>
    </div>
    
    <div class="card" v-else-if="type === 'WaterCirculation'">
      <div class="card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/liquidCirculation.svg">
        </figure>
      </div>
      <div class="card-content">
        <p class="title is-size-5">
          Liquid Circulation
        </p>
        <p class="subtitle">
          {{ rightNowElement }}
        </p>
        <footer class="card-footer">
          <div v-if="state === false" class="card-footer-item">OFF</div>
          <div v-else="state === true" class="card-footer-item">ON</div>
          <button v-show="!automatic" v-on:click="setState('rw')" class="card-footer-item" type="submit" name="action">Toggle</button>
        </footer>
      </div>
      <button v-on:click="classIsActive" class="modal-button">MODAL BUTTON</button>
    </div>
    
    <div class="card" v-else-if="type === 'WaterTemperature'">
      <br/>
      <div class="card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/liquidTemperature.svg">
        </figure>
      </div>
      <div class="card-content">
        <p class="title is-size-5">
          Liquid Temperature [C°]
        </p>
        <p class="subtitle">
          {{ rightNowElement }}
        </p>
      </div>
      <button v-on:click="classIsActive" class="modal-button">MODAL BUTTON</button>
    </div>
    
    <div class="card" v-else-if="type === 'OxygenMonoxide'">
      <div class="card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/co.svg">
        </figure>
      </div>
      <div class="card-content">
        <p class="title is-size-5">
          Oxygen Monoxide [ppm]
        </p>
        <p class="subtitle">
          {{ rightNowElement }}
        </p>
      </div>
      <button v-on:click="classIsActive" class="modal-button">MODAL BUTTON</button>
    </div>
    
    <div class="modal" v-bind:id="type">
      <div class="modal-background"></div>
      <div class="modal-content">
        <line-chart v-show="!showMetrics" class=""
          :chart-data="datacollection"
          :options="{ responsive: true }"
          :width="400" :height="200"
        ></line-chart>
      </div>
      <button class="modal-close is-large" v-on:click="classIsActive" aria-label="close"></button>
    </div>
    
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
const request = require('request-promise-native')
const moment = require('moment')
const randomColor = require('random-material-color')
const LineChart = require('./line-chart')

module.exports = {
  name: 'metric',
  components: {
    LineChart
  },
  props: [ 'uuid', 'type', 'socket', 'automatic', 'showMetrics' ],

  data() {
    return {
      datacollection: {},
      rightNowElement: null,
      error: null,
      color: null,
      $temp: null,
      $level: null,
      $lux: null,
      state: false,
      value: null
    }
  },

  mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      const { uuid, type } = this

      this.color = randomColor.getColor()

      const options = {
        method: 'GET',
        url: `http://localhost:8080/metrics/${uuid}/${type}`,
        json: true
      }

      let result
      try {
        result = await request(options)
      } catch (e) {
        this.error = e.error.error
        return
      }

      const labels = []
      const data = []

      if (Array.isArray(result)) {
        result.forEach(m => {
          labels.push(moment(m.createdAt).format('HH:mm:ss'))
          data.push(m.value)
        })
      }

      this.datacollection = {
        labels,
        datasets: [{
          backgroundColor: this.color,
          label: type,
          data
        }]
      }

      this.startRealtime()
    },

    startRealtime () {
      const { type, uuid, socket } = this

      socket.on('agent/message', payload => {
        if (payload.agent.uuid === uuid) {
          const metric = payload.metrics.find(m => m.type === type)

          // Copy current values
          const labels = this.datacollection.labels
          const data = this.datacollection.datasets[0].data

          this.rightNowElement = metric.value

          // Remove first element if length > 20
          const length = labels.length || data.length

          if (length >= 20) {
            labels.shift()
            data.shift()
          }

          // Add new elements
          labels.push(moment(metric.createdAt).format('HH:mm:ss'))
          data.push(metric.value)

          this.datacollection = {
            labels,
            datasets: [{
              backgroundColor: this.color,
              label: type,
              data
            }]
          }
        }
      })

      this.definedValues()
    },

    definedValues() {
      this.$temp = document.querySelector('#temp')
      this.$level = document.querySelector('#level')
      this.$lux = document.querySelector('#lux')

      this.$temp.value = this.getCookie('temp')
      this.$level.value = this.getCookie('level')
      this.$lux.value = this.getCookie('lux')
    },

    classIsActive() {
      document.querySelector(`#${this.type}`).classList.toggle('is-active')
    },

    getCookie(cname) {
      const name = cname + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },

    setCookie(cname,cvalue,exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var expires = "expires=" + d.toGMTString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },

    handleError (err) {
      this.error = err.message
    },

    setState(option) {
      const { socket } = this
      this.state = this.state ? false : true
      socket.emit('stateSubmit', { state: this.state, option: option })
      console.log('SUBMITED!')
    },

    setValue(option) {
      const { socket } = this
      switch (option) {
        case 'temp':
          this.value = this.$temp.value
          break
        case 'level':
          this.value = this.$level.value
          break
        case 'lux':
          this.value = this.$lux.value
          break
        default:
          break
      }
      this.setCookie(option, this.value, 365);
      socket.emit('valueSubmit', { value: this.value, option: option })
      console.log('SUBMITED!')
    }
  }
}
</script>
