'use strict';

var ping = require('ping');

module.exports = async function (host) {
  return ping.promise.probe(host);
};
