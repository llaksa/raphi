<template>
  <div class="box">
    
    <div v-if="type === 'AirTemperature'" class="">
      <div class="">
        <span class="">Temperatura del Aire [C°] :</span>
      </div>
      <div class="">{{ rightNowElement }}</div>
      <img class="" src="images/sol.jpg">
      <div v-show="!automatic">
        <div class="">
          <input id="temp" type="number" class="validate" value="0" />
        </div>
        <button v-on:click="setValue('temp')" class="" type="submit" name="action">Set</button>
      </div>
    </div>
    
    <div v-else-if="type === 'TankLevel'" class="">
      <div class="">
        <img class="" src="images/sol.jpg">
      </div>
      <div class="">
        <span class="">Nivel de agua [cm] :</span>
      </div>
      <div class="">{{ rightNowElement }}</div>
      <div v-show="!automatic">
        <div class="">
          <input id="level" type="number" class="" value="0" />
        </div>
        <button v-on:click="setValue('level')" class="" type="submit" name="action">Set</button>
      </div>
    </div>
    
    <div v-else-if="type === 'LightIntensity'" class="">
      <div class="">
        <img class="" src="images/sol.jpg">
      </div>
      <div class="">
        <span class="">Intensidad de Luz [lux] :</span>
      </div>
      <div class="">{{ rightNowElement }}</div>
      <div v-show="!automatic">
        <div class="">
          <input id="lux" type="number" class="" value="0" />
        </div>
        <button v-on:click="setValue('lux')" class="" type="submit" name="action">Set</button>
      </div>
    </div>
    
    <div v-else-if="type === 'FreshAir'" class="">
      <div class="">
        <img class="" src="images/sol.jpg">
      </div>
      <div class="">
        <span class="">Aire fresco</span>
      </div>
      <div v-if="state === false" class="">OFF</div>
      <div v-else="state === true" class="">ON</div>
      <div v-show="!automatic">
        <button v-on:click="setState('fa')" class="" type="submit" name="action">Toggle</button>
      </div>
    </div>
    
    <div class="" v-else-if="type === 'FreshWater'">
      <div class="">
        <img class="" src="images/sol.jpg">
      </div>
      <div class="">
        <span class="">Agua fresca</span>
      </div>
      <div v-if="state === false" class="">OFF</div>
      <div v-else="state === true" class="">ON</div>
      <div v-show="!automatic">
        <button v-on:click="setState('fw')" class="" type="submit" name="action">Toggle</button>
      </div>
    </div>
    
    <div class="" v-else-if="type === 'AirCirculation'">
      <div class="">
        <img class="" src="images/sol.jpg">
      </div>
      <div class="">
        <span class="">Circulación de aire</span>
      </div>
      <div v-if="state === false" class="">OFF</div>
      <div v-else="state === true" class="">ON</div>
      <div v-show="!automatic">
        <button v-on:click="setState('ra')" class="" type="submit" name="action">Toggle</button>
      </div>
    </div>
    
    <div class="" v-else-if="type === 'WaterCirculation'">
      <div class="">
        <img class="" src="images/sol.jpg">
      </div>
      <div class="">
        <span class="">Circulación de agua</span>
      </div>
      <div v-if="state === false" class="">OFF</div>
      <div v-else="state === true" class="">ON</div>
      <div v-show="!automatic">
        <button v-on:click="setState('rw')" class="" type="submit" name="action">Toggle</button>
      </div>
    </div>
    
    <div class="" v-else-if="type === 'WaterCirculation'">
      <div class="">
        <img class="" src="images/sol.jpg">
      </div>
      <div class="">
        <span class="">Temperatura del agua [C°]:</span>
      </div>
      <div class="">{{ rightNowElement }}</div>
    </div>
    
    <div class="" v-else-if="type === 'CO'">
      <div class="card-image col s12">
        <img class="" src="images/sol.jpg">
      </div>
      <div class="">
        <span class="">Monóxido de carbono [ppm] :</span>
      </div>
      <div class="">{{ rightNowElement }}</div>
    </div>

    <button v-on:click="classIsActive" class="modal-button">MODAL BUTTON</button>

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
