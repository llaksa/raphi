'use strict'

const Vue    = require('vue')
const App    = require('./app.vue')
const Top    = require('./top.vue')
const Agent  = require('./agent.vue')
const Metric = require('./metric.vue')

Vue.component('top', Top)
Vue.component('agent', Agent)
Vue.component('metric', Metric)

const vm = new Vue({
  el: '#app',
  render (createElement) {
    return createElement(App)
  }
})
