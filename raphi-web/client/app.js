'use strict'

const Vue    = require('vue')
const App    = require('./app.vue')
const Header = require('./header.vue')
const Agent  = require('./agent.vue')
const Metric = require('./metric.vue')

Vue.component('header', Header)
Vue.component('agent', Agent)
Vue.component('metric', Metric)

const vm = new Vue({
  el: '#app',
  render (createElement) {
    return createElement(App)
  }
})
