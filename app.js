'use strict';

require('dotenv').config({});

var PORT = process.env.PORT || 3000;

var express = require('express');

var app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  check().then(function (hosts) {
    res.render('index', { hosts });
  });
});

app.use('/', express.static('public'));

app.listen(PORT);

var fs = require('fs');
const ping = require('./lib/ping');
async function check() {
  return fs.promises
    .readFile('.hosts.json')
    .then(function (data) {
      return JSON.parse(data);
    })
    .then(function (hosts) {
      return Promise.all(
        hosts.map(function (el, i) {
          var req = ping(el.host);
          return req.then(function (res) {
            el.res = res;
            return el;
          });
        })
      );
    })
    .then(function (hosts) {
      console.log(hosts);
      return hosts;
    });
}
