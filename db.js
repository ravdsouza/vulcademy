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
    recording: {type: Number, enum: [0, 1] }
});

// Store list of classes with latest session ID
var classListSchema = new Schema({
    className: String,
    classID: String,
    latestClassSessionID: String,
    record: {type: Number, enum: [0, 1] }
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
    var id = String(Math.random().toString(36).substring(2));
    main.sessionIDLast = id;
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
        recording: 0
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
                    'message': "Successfully created session",
                    'ID': id
                }
            }
        }
        res.status(200).render('index_prof', {
            slowDownCount: 0,
            slowDownPercent: 0, 
            speedUpCount: 0,
            speedUpPercent: 0,
            louderCount: 0,
            louderPercent: 0,
            quieterCount: 0,
            quieterPercent: 0,
            messages: [],
            updatedTime: main.getCurrentTime(),
            courseName: result.className,
            sessionID: id
        });
    });
}

exports.createClass = function(name, user, res){ // classListModel
    var idClass = name.replace(/\s/g, '');
    var response;
    classListModel.create({ 
        className: name,
        classID: idClass,
        latestClassSessionID: null,
        record: 0
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
                    'message': "Successfully created class",
                    'ID': idClass
                }
            }
        }
        var render;
        if (user === 'prof'){ render = 'index_prof'; }
        else { render = 'index_student'; }
        res.status(200).render(render);
        // res.status(200).render(render, { class: name });
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
        } else{
            var response = {
                'error': 0,
                'Message': "Added message successfully"
            };
        }
        res.status(200).send(response);
    });
}

exports.refreshDashProf = function(sessionID, res){
    classModel.findOne({ 'classSessionID': sessionID }, '', function (err, result) {
        var response;
        if (err){
            response = {
                'error': 1,
                'Message': err
            }
            res.status(200).send(response);
        } else{
            response = {
                'error':0,
                'Message': result
            }
        }
        messagesModel.find({ 'sessionID': sessionID }, '', function (err, results) {
            if (err){
                response = {
                    'error': 1,
                    'Message': err
                }
                res.status(200).send(response);
            } else{
                response = {
                    'error':0,
                    'Message': results
                }
            }
            // Speed up, slow down, louder, quieter actions
            var slowPercent, fastPercent, loudPercent, quietPercent;
            if (result.slowDownCount === 0 && result.speedUpCount === 0){ 
                slowPercent = 0;
                fastPercent = 0;
            }
            else { 
                slowPercent = parseInt(result.slowDownCount/(result.slowDownCount + result.speedUpCount) * 100);
                fastPercent = parseInt(result.speedUpCount/(result.slowDownCount + result.speedUpCount) * 100);
            }
            if (result.louderCount === 0 && result.quieterCount === 0){ 
                loudPercent = 0;
                quietPercent = 0;
            }
            else { 
                loudPercent = parseInt(result.louderCount/(result.louderCount + result.quieterCount) * 100);
                quietPercent = parseInt(result.quieterCount/(result.louderCount + result.quieterCount) * 100);
            }
            // Messages
            var messages = [];
            results.forEach(function(message){
                messages.splice(0, 0, {
                    name: message.sender,
                    text: message.message,
                    time: message.time,
                    avatar: message.avatar
                });
            });
            res.status(200).render('index_prof', {
                slowDownCount: result.slowDownCount,
                slowDownPercent: slowPercent, 
                speedUpCount: result.speedUpCount,
                speedUpPercent: fastPercent,
                louderCount: result.louderCount,
                louderPercent: loudPercent,
                quieterCount: result.quieterCount,
                quieterPercent: quietPercent,
                messages: messages,
                updatedTime: main.getCurrentTime(),
                courseName: result.className,
                sessionID: sessionID
            });
        });
    });
}

exports.updateRecordStatus = function(newStatus, classID, res){
    if (newStatus === 'false'){ newStatus = 0; } 
    else{ newStatus = 1; }
    // Class
    classListModel.update({ classID: classID }, {$set: { record: newStatus }}, { upsert: true });
    // Session
    classModel.update({ classID: classID }, {$set: { recording: newStatus }}, { upsert: true });
    var response = {
        'error': 0,
        'Message': 'Successfully updated record status'
    }
    res.status(200).send(response);
}