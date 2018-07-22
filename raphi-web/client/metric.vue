<template>
  <div class="column is-one-quarter">
    
    <div v-if="type === 'AirTemperature'" class="card">
      <br/>
      <div v-on:click="classIsActive" class="modal-button card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/airTemperature.png">
        </figure>
      </div>
      <br/>
      <div class="card-content has-background-light">
        <p class="title is-size-5">Air Temperature</p>
        <p class="subtitle tag is-warning">{{ Math.round(rightNowElement * 10) / 10 }} C°</p>
        <div v-show="!automatic" class="field has-addons">
          <div class="control">
            <input id="temp" class="input is-success" type="number" value="0">
          </div>
          <div class="control">
            <button class="button is-success" v-on:click="setValue('temp')" type="submit" name="action">Set</button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="type === 'TankLevel'" class="card">
      <br/>
      <div v-on:click="classIsActive" class="modal-button card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/tankLevel.png">
        </figure>
      </div>
      <br/>
      <div class="card-content has-background-light">
        <p class="title is-size-5">Nutritive Solution Level</p>
        <p class="subtitle tag is-warning">{{ Math.round(rightNowElement * 10) / 10 }} cm</p>
        <div v-show="!automatic" class="field has-addons">
          <div class="control">
            <input id="level" class="input is-success" type="number" value="0">
          </div>
          <div class="control">
            <button class="button is-success" v-on:click="setValue('level')" type="submit" name="action">Set</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'LightIntensity'" class="card">
      <br/>
      <div v-on:click="classIsActive" class="modal-button card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/lightIntensity.svg">
        </figure>
      </div>
      <br/>
      <div class="card-content has-background-light">
        <p class="title is-size-5">Light Intensity</p>
        <p class="subtitle tag is-warning">{{ Math.round(rightNowElement * 65535 / 255) }} lx</p>
        <div v-show="!automatic" class="field has-addons">
          <div class="control">
            <input id="lux" class="input is-success" type="number" value="0">
          </div>
          <div class="control">
            <button class="button is-success" v-on:click="setValue('lux')" type="submit" name="action">Set</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'FreshAir'" class="card">
      <br/>
      <div v-on:click="classIsActive" class="modal-button card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/freshAir.png">
        </figure>
     </div>
      <br/>
      <div class="card-content has-background-light">
        <p class="title is-size-5">Fresh Air</p>
        <p class="subtitle tag is-warning">{{ rightNowElement }}</p>
        <div class="field is-grouped is-vertical-centered">
          <div v-if="rightNowElement === false" class="control is-large is-expanded tag is-primary">
            <p>OFF</p>
          </div>
          <div v-else class="control is-large is-expanded tag is-danger">
            <p>ON</p>
          </div>
          <div class="control" v-show="!automatic">
            <button v-show="!automatic" v-on:click="setState('fa')" class="button is-success" type="submit" name="action">Toggle</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card" v-else-if="type === 'FreshNutriSol'">
      <br/>
      <div v-on:click="classIsActive" class="modal-button card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/freshNutriSol.png">
        </figure>
      </div>
      <br/>
      <div class="card-content has-background-light">
        <p class="title is-size-5">Fresh Nutritive Solution</p>
        <p class="subtitle tag is-warning">{{ rightNowElement }}</p>
        <div class="field is-grouped is-vertical-centered">
          <div v-if="rightNowElement === false" class="control is-large is-expanded tag is-primary">
            <p>OFF</p>
          </div>
          <div v-else class="control is-large is-expanded tag is-danger">
            <p>ON</p>
          </div>
          <div class="control" v-show="!automatic">
            <button v-show="!automatic" v-on:click="setState('fw')" class="button is-success" type="submit" name="action">Toggle</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card" v-else-if="type === 'AirCirculation'">
      <br/>
      <div v-on:click="classIsActive" class="modal-button card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/airCirculation.png">
        </figure>
      </div>
      <br/>
      <div class="card-content has-background-light">
        <p class="title is-size-5">Air Circulation</p>
        <p class="subtitle tag is-warning">{{ rightNowElement }}</p>
        <div class="field is-grouped is-vertical-centered">
          <div v-if="rightNowElement === false" class="control is-large is-expanded tag is-primary">
            <p>OFF</p>
          </div>
          <div v-else class="control is-large is-expanded tag is-danger">
            <p>ON</p>
          </div>
          <div class="control" v-show="!automatic">
            <button v-show="!automatic" v-on:click="setState('ra')" class="button is-success" type="submit" name="action">Toggle</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card" v-else-if="type === 'NutriSolCirculation'">
      <br/>
      <div v-on:click="classIsActive" class="modal-button card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/nutriSolCirculation.png">
        </figure>
      </div>
      <br/>
      <div class="card-content has-background-light">
        <p class="title is-size-5">Nutritive Solution Circulation</p>
        <p class="subtitle tag is-warning">{{ rightNowElement }}</p>
        <div class="field is-grouped is-vertical-centered">
          <div v-if="rightNowElement === false" class="control is-large is-expanded tag is-primary">
            <p>OFF</p>
          </div>
          <div v-else class="control is-large is-expanded tag is-danger">
            <p>ON</p>
          </div>
          <div class="control" v-show="!automatic">
            <button v-show="!automatic" v-on:click="setState('rw')" class="button is-success" type="submit" name="action">Toggle</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card" v-else-if="type === 'NutriSolTemperature'">
      <br/>
      <div v-on:click="classIsActive" class="modal-button card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/nutriSolTemperature.png">
        </figure>
      </div>
      <br/>
      <div class="card-content has-background-light">
        <p class="title is-size-5">Nutritive Solution Temperature</p>
        <p class="subtitle tag is-warning">{{ Math.round(rightNowElement * 10) / 10 }} C°</p>
      </div>
    </div>
    
    <div class="card" v-else-if="type === 'OxygenMonoxide'">
      <br/>
      <div v-on:click="classIsActive" class="modal-button card-image is-flex is-horizontal-centered">
        <figure class="image is-128x128">
          <img class="" src="images/co.png">
        </figure>
      </div>
      <br/>
      <div class="card-content has-background-light">
        <p class="title is-size-5">Oxygen Monoxide</p>
        <p class="subtitle tag is-warning">{{ Math.round( rightNowElement * 10 ) / 10 }} ppm</p>
      </div>
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
        url: `http://192.168.1.8:8080/metrics/${uuid}/${type}`,
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
