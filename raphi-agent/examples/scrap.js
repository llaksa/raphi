var request = require('request');
var cheerio = require('cheerio');

request('http://localhost:8080/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    const a = $('').html();
    console.log(html);
  }
});
