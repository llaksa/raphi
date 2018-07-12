'use strict'

const { Bar, mixins } = require('vue-chartjs')
const { reactiveProp } = mixins

module.exports = Bar.extend({
  mixins: [ reactiveProp ],
  props: [ 'options' ],
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})
