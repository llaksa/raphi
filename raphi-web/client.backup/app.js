'use strict'

const Vue    = require('vue')
const App    = require('./app.vue')
const Agent  = require('./agent.vue')
const Metric = require('./metric.vue')

Vue.component('agent', Agent)
Vue.component('metric', Metric)

const vm = new Vue({
  el: '#app',
  render (createElement) {
    return createElement(App)
  }
})
