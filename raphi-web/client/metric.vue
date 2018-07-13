<template>
  <div class="box valign-wrapper">

    <div class="card col s4" v-if="automatic === false">

      <div v-if="type === 'Temperatura-aire'" class="">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Temperatura del Aire [C°] :</span>
        </div>
        <div class="black-text pink accent-2 btn-small col s3">{{ rightNowElement }}</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
        <div class="col s6">
          <input id="temp" type="number" class="validate" value="0" />
        </div>
        <button v-on:click="setValue('temp')" class="light-blue darken-4 btn-small col s6" type="submit" name="action">Set</button>
      </div>

      <div v-else-if="type === 'Nivel-tanque'" class="">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Nivel de agua [cm] :</span>
        </div>
        <div class="black-text pink accent-2 btn-small col s3">{{ rightNowElement }}</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
        <div class="col s6">
          <input id="level" type="number" class="validate" value="0" />
        </div>
        <button v-on:click="setValue('level')" class="light-blue darken-4 btn-small col s6" type="submit" name="action">Set</button>
      </div>

      <div v-else-if="type === 'Intensidad-Luz'" class="">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Intensidad de Luz [lux] :</span>
        </div>
        <div class="black-text pink accent-2 btn-small col s3">{{ rightNowElement }}</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
        <div class="col s6">
          <input id="lux" type="number" class="validate" value="0" />
        </div>
        <button v-on:click="setValue('lux')" class="light-blue darken-4 btn-small col s6" type="submit" name="action">Set</button>
      </div>

      <div v-else-if="type === 'Aire-fresco'" class="">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Aire fresco</span>
        </div>
        <div v-if="state === false" id="freshAir" class="black-text red accent-2 btn-small col s3">OFF</div>
        <div v-else="state === true" id="freshAir" class="white-text green darken-1 btn-small col s3">ON</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
        <button v-on:click="setState('fa')" class="white-text cyan darken-4 btn-small col s12" type="submit" name="action">Toggle</button>
      </div>

      <div class="" v-else-if="type === 'Agua-fresca'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Agua fresca</span>
        </div>
        <div v-if="state === false" id="freshWater" class="black-text red accent-2 btn-small col s3">OFF</div>
        <div v-else="state === true" id="freshWater" class="white-text green darken-1 btn-small col s3">ON</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
        <button v-on:click="setState('fw')" class="white-text cyan darken-4 btn-small col s12" type="submit" name="action">Toggle</button>
      </div>

      <div class="" v-else-if="type === 'Aire-circulante'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Circulación de aire</span>
        </div>
        <div v-if="state === false" id="roundAir" class="black-text red accent-2 btn-small col s3">OFF</div>
        <div v-else="state === true" id="roundAir" class="white-text green darken-1 btn-small col s3">ON</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
        <button v-on:click="setState('ra')" class="white-text cyan darken-4 btn-small col s12" type="submit" name="action">Toggle</button>
      </div>

      <div class="" v-else-if="type === 'Agua-circulante'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Circulación de agua</span>
        </div>
        <div v-if="state === false" id="roundWater" class="black-text red accent-2 btn-small col s3">OFF</div>
        <div v-else="state === true" id="roundWater" class="white-text green darken-1 btn-small col s3">ON</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
        <button v-on:click="setState('rw')" class="white-text cyan darken-4 btn-small col s12" type="submit" name="action">Toggle</button>
      </div>

      <div class="" v-else-if="type === 'Temperatura-agua'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Temperatura del agua [C°]:</span>
        </div>
        <div class="black-text purple accent-2 btn-small col s3">{{ rightNowElement }}</div>
      <div class="card-image">
        <img src="images/sol.jpg">
      </div>
      </div>

      <div class="" v-else-if="type === 'CO'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Monóxido de carbono [ppm] :</span>
        </div>
        <div class="black-text purple accent-2 btn-small col s3">{{ rightNowElement }}</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
      </div>
    </div>

    <div class="card col s4" v-else>
      <div v-if="type === 'Temperatura-aire'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Temperatura del aire [C°] :</span>
        </div>
        <div class="black-text pink accent-2 btn-small col s3">{{ rightNowElement }}</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
      </div>

      <div v-else-if="type === 'Nivel-tanque'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">NIvel de agua [cm] :</span>
        </div>
        <div class="black-text pink accent-2 btn-small col s3">{{ rightNowElement }}</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
      </div>

      <div v-else-if="type === 'Intensidad-Luz'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Intensidad de luz [lux] :</span>
        </div>
        <div class="black-text pink accent-2 btn-small col s3">{{ rightNowElement }}</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
      </div>

      <div v-else-if="type === 'Aire-fresco'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Aire fresco</span>
        </div>
        <div v-if="state === false" id="freshAir" class="black-text red accent-2 btn-small col s3">OFF</div>
        <div v-else="state === true" id="freshAir" class="white-text green darken-1 btn-small col s3">ON</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
      </div>

      <div v-else-if="type === 'Agua-fresca'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Agua fresca</span>
        </div>
        <div v-if="state === false" id="freshAir" class="black-text red accent-2 btn-small col s3">OFF</div>
        <div v-else="state === true" id="freshAir" class="white-text green darken-1 btn-small col s3">ON</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
      </div>

      <div v-else-if="type === 'Aire-circulante'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Circulación de aire</span>
        </div>
        <div v-if="state === false" id="freshAir" class="black-text red accent-2 btn-small col s3">OFF</div>
        <div v-else="state === true" id="freshAir" class="white-text green darken-1 btn-small col s3">ON</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
      </div>

      <div v-else-if="type === 'Agua-circulante'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Circulación de agua</span>
        </div>
        <div v-if="state === false" id="freshAir" class="black-text red accent-2 btn-small col s3">OFF</div>
        <div v-else="state === true" id="freshAir" class="white-text green darken-1 btn-small col s3">ON</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
      </div>

      <div v-else-if="type === 'Temperatura-agua'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 btn-small col s9">
          <span class="">Temperatura del agua [C°] :</span>
        </div>
        <div class="black-text purple accent-2 btn-small col s3">{{ rightNowElement }}</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
      </div>

      <div v-else-if="type === 'CO'">
        <div v-on:click="toggleOneMetric" class="black-text orange accent-3 tn-small col s9">
          <span class="">Monóxido de carbono [ppm] :</span>
        </div>
        <div class="black-text purple accent-2 btn-small col s3">{{ rightNowElement }}</div>
        <div class="card-image">
          <img src="images/sol.jpg">
        </div>
      </div>
    </div>

    <line-chart v-show="showMetrics" class="card col s8"
      :chart-data="datacollection"
      :options="{ responsive: true }"
      :width="400" :height="200"
    ></line-chart>

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
      showOneMetric: false,
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

      this.$box = document.querySelector('.box')

      this.$temp.value = this.getCookie('temp')
      this.$level.value = this.getCookie('level')
      this.$lux.value = this.getCookie('lux')
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

    toggleOneMetric() {
      this.$box.classList.toggle('row')
      this.showOneMetric = this.showOneMetric ? false : true
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
