exports = module.exports = {};
// REQUIRED NODE MODULES //
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
// DECLARE MONGODB AND MONGOOSE //
var mongoDB = "mongodb://vulcademy:hackValley22018%23@cluster0-shard-00-00-gv6i4.mongodb.net:27017,cluster0-shard-00-01-gv6i4.mongodb.net:27017,cluster0-shard-00-02-gv6i4.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
mongoose.connect(mongoDB);
// SETUP MONGOOSE //
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

exports.message = "Hello";
// // DEFINE A SCHEMA //
var Schema = mongoose.Schema;

// Store list of class sessions (session = one class (ie. 90 min))
var classSchema = new Schema({
    className: String,
    classID: String,
    classSessionID: String,
    speedUpCount: Number,
    slowDownCount: Number,
    louderCount: Number,
    quieterCount: Number,
    starRating: {type: Number, enum: [1, 2, 3, 4, 5]},
    messages: [],
    bufferTime: {type: Number, enum: [1, 5, 10, 60]},
    recording: Boolean
});

// Store list of classes with latest session ID
var classListSchema = new Schema({
    className: String,
    classID: String,
    latestClassSessionID: String
});

// Store messages
var messagesSchema = new Schema({
    message: String,
    time: String,
    sessionID: String,
    sender: String
});

// CREATE AND SAVE A MODEL //
// Compile model from schema
var classModel = mongoose.model('ClassModel', classSchema);
var classListModel = mongoose.model('ClassListModel', classListSchema);
var messagesModel = mongoose.model('MessagesModel', messagesSchema);

exports.createSession = function(name, idClass){
    // Generate random ID string
    var id = ''; //
    classModel.create({
        className: name,
        classID: idClass,
        classSessionID: id,
        speedUpCount: 0,
        slowDownCount: 0,
        louderCount: 0,
        quieterCount: 0,
        starRating: 0,
        messages: [],
        bufferTime: 60,
        recording: false
    }, function (err, result) {
        if (err){
            return {
                'error': 1,
                'Message': err
            }
        } else{
            return {
                'error':0,
                'Message': {
                    'message': result,
                    'ID': id
                }
            }
        }
    });
}

exports.createClass = function(name){ // classListModel
    // Generate classID (remove spaces from class name)
    idClass = ''; //
    classListModel.create({ 
        className: name,
        classID: idClass,
        latestClassSessionID: null
    }, function (err, result) {
        if (err){
            return {
                'error': 1,
                'Message': err
            }
        } else{
            return {
                'error':0,
                'Message': {
                    'message': result,
                    'ID': idClass
                }
            }
        }
    });
}

exports.addAction = function(action, sessionID){ // classModel
    classModel.findOne({ 'classSessionID': sessionID }, '', function (err, results) {
        // Update results?
        if (err){
            return {
                'error': 1,
                'Message': err
            }
        } else{
            return {
                'error':0,
                'Message': result
            }
        }
    });
}

exports.addMessage = function(message, sessionID, sender){
    var dateTime = new Date();
    var hour = (parseInt(dateTime.getHours()) > 9) ? dateTime.getHours() : "0" + dateTime.getHours();
    var minutes = (parseInt(dateTime.getMinutes()) > 9) ? dateTime.getMinutes() : "0" + dateTime.getMinutes();
    var seconds = (parseInt(dateTime.getSeconds()) > 9) ? dateTime.getSeconds() : "0" + dateTime.getSeconds();
    var time = hour + ":" + minutes + ":" + seconds;
    messagesModel.create({ 
        message: message,
        time: time,
        sessionID: sessionID,
        sender: sender
    }, function (err, result) {
        if (err){
            var response = JSON.stringify({
                'error': 1,
                'Message': err
            });
            console.log("RESPONSE: ", response);
        } else{
            var response = JSON.stringify({
                'error': 0,
                'Message': "Added message successfully"
            });
            console.log("RESPONSE: ", response);
            console.log(typeof response);
        }
    });
}

exports.sayHello = function(name){
    return "Hello, " + name;
}