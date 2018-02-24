exports = module.exports = {};
var main = require('./main.js');
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
    latestClassSessionID: String,
    record: Boolean
});

// Store messages
var messagesSchema = new Schema({
    message: String,
    time: String,
    sessionID: String,
    sender: String,
    avatar: String
});

// CREATE AND SAVE A MODEL //
// Compile model from schema
var classModel = mongoose.model('ClassModel', classSchema);
var classListModel = mongoose.model('ClassListModel', classListSchema);
var messagesModel = mongoose.model('MessagesModel', messagesSchema);

exports.createSession = function(name, idClass, res){
    // Generate random ID string
    var id = ''; //
    var response;
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
            response = {
                'error': 1,
                'Message': err
            }
        } else{
            response = {
                'error':0,
                'Message': {
                    'message': result,
                    'ID': id
                }
            }
        }
        res.status(200).send(response);
    });
}

exports.createClass = function(name, res){ // classListModel
    // Generate classID (remove spaces from class name)
    var idClass = ''; //
    var response;
    classListModel.create({ 
        className: name,
        classID: idClass,
        latestClassSessionID: null,
        record: false
    }, function (err, result) {
        if (err){
            response = {
                'error': 1,
                'Message': err
            }
        } else{
            response = {
                'error':0,
                'Message': {
                    'message': result,
                    'ID': idClass
                }
            }
        }
        res.status(200).send(response);
    });
}

exports.addAction = function(action, sessionID, res){ // classModel
    classModel.findOne({ 'classSessionID': sessionID }, '', function (err, results) {
        // Update results?
        var response;
        if (err){
            response = {
                'error': 1,
                'Message': err
            }
        } else{
            rresponse = {
                'error':0,
                'Message': result
            }
        }
        res.status(200).send(response);
    });
}

// Add adding message to class
exports.addMessage = function(message, sessionID, sender, avatar, res){
    var time = main.getCurrentTime();
    messagesModel.create({ 
        message: message,
        time: time,
        sessionID: sessionID,
        sender: sender,
        avatar: avatar
    }, function (err, result) {
        if (err){
            var response = {
                'error': 1,
                'Message': err
            };
            console.log("RESPONSE: ", response);
        } else{
            var response = {
                'error': 0,
                'Message': "Added message successfully"
            };
            console.log("RESPONSE: ", response);
        }
        res.status(200).send(response);
    });
}

exports.refreshDashProf = function(res){
    // Call db to get data
    var slowDownCount = 5;
    var speedUpCount = 6;
    var louderCount = 8;
    var quieterCount = 2;
    var slowDownPercent = parseInt(slowDownCount/(slowDownCount + speedUpCount) * 100);
    var speedUpPercent = parseInt(speedUpCount/(slowDownCount + speedUpCount) * 100);
    var louderPercent = parseInt(louderCount/(louderCount + quieterCount) * 100);
    var quieterPercent = parseInt(quieterCount/(quieterCount + louderCount) * 100);
    var messages = [{name: "Allyson Giannikouris", text: "Will these slides be on Learn?", time: "14:25:30", avatar: '10'}, 
    {name: "Feridun Hamdullahpur", text: "Will this lecture be on the midterm?", time: "13:55:33", avatar: '5'}, 
    {name: "Carla Daniels", text: "Can you explain how a BST works?", time: "13:35:59", avatar: '6'}]
    var time = main.getCurrentTime();
    console.log("Time: ", time);
    res.render('index_prof', {
        slowDownCount: slowDownCount,
        slowDownPercent: slowDownPercent, 
        speedUpCount: speedUpCount,
        speedUpPercent: speedUpPercent,
        louderCount: louderCount,
        louderPercent: louderPercent,
        quieterCount: quieterCount,
        quieterPercent: quieterPercent,
        messages: messages,
        updatedTime: time
    });
}

exports.updateRecordStatus = function(newStatus, classID, res){
    if (newStatus === 'false'){ newStatus = false; } 
    else{ newStatus = true; }
    console.log(newStatus);
    classListModel.update({ classID: "classID" }, {$set: { record: true }}, { upsert: true }, function(err, result){
        console.log("ERR", err);
        console.log("Result: ", result);
    });
    var response = {
        'error': 0,
        'Message': 'Successfully updated record status'
    }
    res.status(200).send(response);
}