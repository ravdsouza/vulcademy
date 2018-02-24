exports = module.exports = {};
var db = require('./db.js');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

exports.express = express;
exports.app = app;
exports.path = path;
exports.bodyParser = bodyParser;

exports.sayHello = function(name = "Nicole"){
    return "Hello, " + name;
}

