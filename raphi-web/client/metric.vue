<template>
  <div class="row">

    <div v-if="automatic === false">
      <div v-if="type === 'Temperatura-aire'" class="valign-wrapper" >
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s7">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div class="input-field inline col s4">
          <input id="temp" type="number" class="validate" value="0" />
          <label class="white-text active" for="temp">[ Centigrade (C°) ]:</label>
        </div>
      </div>

      <div v-else-if="type === 'Nivel-tanque'" class="valign-wrapper">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s7">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div class="input-field inline col s4">
          <input id="level" type="number" class="validate" value="0" />
          <label class="white-text active" for="level">[ Centimeter (cm) ]:</label>
        </div>
      </div>

      <div v-else-if="type === 'Intensidad-Luz'" class="valign-wrapper">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s7">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div class="input-field inline col s4">
          <input id="lux" type="number" class="validate" value="0" />
          <label class="white-text active" for="lux">[ Lux (Lx) ]:</label>
        </div>
      </div>
    
      <div v-else-if="type === 'Aire-fresco'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s7">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div v-on:click="toggleOnOff">
          <div v-if="onoff === true" class="green waves-effect waves-light btn-small col s4">
            <span id="freshAir" class="black-text">ON</span>
          </div>
          <div v-else class="red waves-effect waves-light btn-small col s4">
            <span id="freshAir">OFF</span>
          </div>
        </div>
      </div>
      
      <div v-else-if="type === 'Agua-fresca'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s7">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div v-on:click="toggleOnOff">
          <div v-if="onoff === true" class="green waves-effect waves-light btn-small col s4">
            <span id="freshWater" class="black-text">ON</span>
          </div>
          <div v-else class="red waves-effect waves-light btn-small col s4">
            <span id="freshWater">OFF</span>
          </div>
        </div>
      </div>
      
      <div v-else-if="type === 'Aire-circulante'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s7">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div v-on:click="toggleOnOff">
          <div v-if="onoff === true" class="green waves-effect waves-light btn-small col s4">
            <span id="roundAir" class="black-text">ON</span>
          </div>
          <div v-else class="red waves-effect waves-light btn-small col s4">
            <span id="roundAir">OFF</span>
          </div>
        </div>
      </div>
      
      <div v-else-if="type === 'Agua-circulante'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s7">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
        <div class="col s1">
        </div>
        <div v-on:click="toggleOnOff">
          <div v-if="onoff === true" class="green waves-effect waves-light btn-small col s4">
            <span id="roundWater" class="black-text">ON</span>
          </div>
          <div v-else class="red waves-effect waves-light btn-small col s4">
            <span id="roundWater">OFF</span>
          </div>
        </div>
      </div>
      
      <div v-else-if="type === 'Temperatura-agua'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s7">
          <span class="">{{ type }} : {{ rightNowElement }}</span>
        </div>
      </div>
      
      <div v-else-if="type === 'CO'">
        <div v-on:click="toggleOneMetric" class="brown darken-1 waves-effect waves-light btn-small col s7">
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
      onoff: false,
      error: null,
      color: null
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
    },

    handleError (err) {
      this.error = err.message
    },

    toggleOneMetric() {
      this.showOneMetric = this.showOneMetric ? false : true
    },

    toggleOnOff() {
      this.onoff = this.onoff ? false : true
    }
  }
}
</script>
