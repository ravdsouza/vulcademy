exports = module.exports = {};
var db = require('./db.js');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var sessionIDLast
exports.express = express;
exports.app = app;
exports.path = path;
exports.bodyParser = bodyParser;
exports.sessionIDLast = sessionIDLast;


exports.getCurrentTime = function(){
    var dateTime = new Date();
    var hour = (parseInt(dateTime.getHours()) > 9) ? dateTime.getHours() : "0" + dateTime.getHours();
    var minutes = (parseInt(dateTime.getMinutes()) > 9) ? dateTime.getMinutes() : "0" + dateTime.getMinutes();
    var seconds = (parseInt(dateTime.getSeconds()) > 9) ? dateTime.getSeconds() : "0" + dateTime.getSeconds();
    return hour + ":" + minutes + ":" + seconds;
}


