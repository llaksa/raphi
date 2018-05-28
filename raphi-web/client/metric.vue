<template>
  <div class="row">

    <div v-if="automatic === false">

      <div v-if="type === 'Temperatura-aire'" class="valign-wrapper">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s5">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div class="input-field inline col s4">
          <label class="white-text active" for="temp">[ Centigrade (C) ]:</label>
          <input id="temp" type="number" class="validate" value="0" />
        </div>
        <button v-on:click="tempValue" class="btn-small waves-effect waves-light col s2" type="submit" name="action">Submit</button>
      </div>

      <div v-else-if="type === 'Nivel-tanque'" class="valign-wrapper">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s5">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div class="input-field inline col s4">
          <label class="white-text active" for="level">[ Centimeter (cm) ]:</label>
          <input id="level" type="number" class="validate" value="0" />
        </div>
        <button v-on:click="levelValue" class="btn-small waves-effect waves-light col s2" type="submit" name="action">Submit</button>
      </div>

      <div v-else-if="type === 'Intensidad-Luz'" class="valign-wrapper">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s5">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div class="input-field inline col s4">
          <label class="white-text active" for="lux">[ Lux (Lx) ]:</label>
          <input id="lux" type="number" class="validate" value="0" />
        </div>
        <button v-on:click="luxValue" class="btn-small waves-effect waves-light col s2" type="submit" name="action">Submit</button>
      </div>

      <div v-else-if="type === 'Aire-fresco'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s5">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div v-if="btn === false" id="freshAir" class="red waves-effect waves-light btn-small col s4">OFF</div>
        <div v-else="btn === true" id="freshAir" class="white-text green waves-effect waves-light btn-small col s4">ON</div>
        <button v-on:click="toggleBtn('#freshAir')" class="btn-small waves-effect waves-light col s2" type="submit" name="action">Submit</button>
      </div>
      
      <div v-else-if="type === 'Agua-fresca'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s5">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div v-if="btn === false" id="freshWater" class="red waves-effect waves-light btn-small col s4">OFF</div>
        <div v-else="btn === true" id="freshWater" class="white-text green waves-effect waves-light btn-small col s4">ON</div>
        <button v-on:click="toggleBtn('#freshAir')" class="btn-small waves-effect waves-light col s2" type="submit" name="action">Submit</button>
      </div>

      <div v-else-if="type === 'Aire-circulante'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s5">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div v-if="btn === false" id="roundAir" class="red waves-effect waves-light btn-small col s4">OFF</div>
        <div v-else="btn === true" id="roundAir" class="white-text green waves-effect waves-light btn-small col s4">ON</div>
        <button v-on:click="toggleBtn('#freshAir')" class="btn-small waves-effect waves-light col s2" type="submit" name="action">Submit</button>
      </div>
      
      <div v-else-if="type === 'Agua-circulante'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s5">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div v-if="btn === false" id="roundWater" class="red waves-effect waves-light btn-small col s4">OFF</div>
        <div v-else="btn === true" id="roundWater" class="white-text green waves-effect waves-light btn-small col s4">ON</div>
        <div v-on:click="toggleBtn('#freshAir')" class="btn-small waves-effect waves-light col s2" type="submit" name="action">Submit</div>
      </div>
      
      <div v-else-if="type === 'Temperatura-agua'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s5">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>

      <div v-else-if="type === 'CO'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s5">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="type === 'Temperatura-aire'" class="valign-wrapper" >
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s12">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>
      
      <div v-else-if="type === 'Nivel-tanque'" class="valign-wrapper">
        <div v-on:click="toggleOneMetric" class="brown darken-1 orange lighten-2 waves-effect waves-light btn-small col s12">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>
      
      <div v-else-if="type === 'Intensidad-Luz'" class="valign-wrapper">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s12">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>
      
      <div v-else-if="type === 'Aire-fresco'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s12">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>
      
      <div v-else-if="type === 'Agua-fresca'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s12">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>
      
      <div v-else-if="type === 'Aire-circulante'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s12">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>
      
      <div v-else-if="type === 'Agua-circulante'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s12">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>
      
      <div v-else-if="type === 'Temperatura-agua'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s12">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>
      
      <div v-else-if="type === 'CO'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s12">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>
    </div>
    
    <line-chart v-show="showOneMetric" class="card col s12 grey"
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
  props: [ 'uuid', 'type', 'socket', 'automatic' ],

  data() {
    return {
      datacollection: {},
      showOneMetric: false,
      rightNowElement: null,
      btn: false,
      error: null,
      color: null,
      $temp: null,
      $level: null,
      $lux: null
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

    getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
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
      this.showOneMetric = this.showOneMetric ? false : true
    },

    toggleBtn() {
      const { socket } = this
      this.btn = this.btn ? false : true
      socket.emit('onoffSubmit', { state: this.btn })
      console.log('SUBMITED!')
    },

    tempValue() {
      const { socket } = this
      this.setCookie('temp', this.$temp.value, 365);
      socket.emit('pidSubmit', { state: this.$temp.value })
      console.log('SUBMITED!')
    },

    levelValue() {
      const { socket } = this
      this.setCookie('level', this.$level.value, 365);
      socket.emit('pidSubmit', { state: this.$level.value })
      console.log('SUBMITED!')
    },

    luxValue() {
      const { socket } = this
      this.setCookie('lux', this.$lux.value, 365);
      socket.emit('pidSubmit', { state: this.$lux.value })
      console.log('SUBMITED!')
    }
  }
}
</script>
