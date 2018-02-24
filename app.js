var main = require('./main.js');
var db = require('./db.js');

main.app.use(main.express.static(main.path.join(__dirname, 'public')));
// app.use(cors());
/* Use body-parser */
main.app.use(main.bodyParser.json());
main.app.use(main.bodyParser.urlencoded({ extended: false }));

//At root route render index.html
main.app.get('/', function(req, res){
  res.sendFile(main.path.join(__dirname, 'public/index.html'));
});

// Update action in db (called when user clicks an action button)
main.app.post('/post-action', function(req, res){
    var action = req.body.action;
    var sessionID = req.body.sessionID;
    var success = main.addAction(action, sessionID);
    if (success){ res.status(200).send({"error": 0, "Message": "Updating " + action + " successful"}); } 
    else{ res.status(200).send({"error": 1, "Message": "Updating " + action + " failed"}); }
});

// Retrieves the count of the action buttons
main.app.get('/get-action', function(req, res){
    // Retrieve count of actions from DB
});

main.app.post('/post-create-class', function(req, res){
    var className = req.body.className;
    var createClass = db.createClass(className);
    res.status(200).send(createClass);
});

// Create a session id for a class (can only be done by professor)
main.app.post('/post-create-class-session', function(req, res){
    var className = req.body.className;
    var idClass = req.body.idClass;
    var createSession = db.createSession(className, idClass);
    res.status(200).send(createSession);
});

main.app.post('/post-message', function(req, res){
    var message = req.body.message;
    var idClass = req.body.idClass;
    var sender = req.body.sender;
    console.log("RESPONSE(app.js): ", db.addMessage(message, idClass, sender));
    console.log(db.sayHello("Nicole"));
    res.status(200).send("Test /post-message");
    // var addMessage = db.addMessage(message, idClass, sender);
    // console.log(typeof addMessage);
    // // addMessage = JSON.parse(addMesssage);
    // // res.status(200).send(addMessage);
    // console.log(addMessage);
    // res.status(200).send("Hello World");
});

main.app.listen(7000, function () {
    console.log('Example app listening on 7000');
});

