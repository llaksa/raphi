/*
var casper = require('casper').create();

casper.start('http://localhost:8080/', function() {
  this.echo(this.getTitle());
});

casper.run();
*/

var casper = require('casper').create();

casper.start('http://localhost:8080');
casper.then(function() {
  var elements = this.querySelector('#temp');
  casper.echo('Num elements: ' + elements.length);
});

casper.run();
