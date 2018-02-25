var main = require('./main.js');
var db = require('./db.js');

main.app.use(main.express.static(main.path.join(__dirname, 'public')));
// app.use(cors());
/* Use body-parser */
main.app.use(main.bodyParser.json());
main.app.use(main.bodyParser.urlencoded({ extended: false }));

main.app.set('view engine', 'ejs');

// At root route render index.html
main.app.get('/', function(req, res){
    res.render('login');
});

// Refress professor dashboard
main.app.get('/dashboard-prof', function(req, res){
    var sessionID = main.sessionIDLast;
    var className = main.classNameLast;
    db.refreshDashProf(sessionID, className, res);
});

// Refresh student dashboard
main.app.get('/dashboard-student', function(req, res){
    var sessionID = main.sessionIDLast;
    var className = main.classNameLast;
    db.refreshDashStudent(sessionID, className, res);
});

main.app.get('/get-action/:action/:sessionID', function(req, res){
    console.log(req.params);
    var action = req.params.action;
    var sessionID = req.params.sessionID;
    console.log(sessionID);
    db.addAction(action, sessionID, res);
});

main.app.get('/get-message/:message/:name/:avatar/:sessionID', function(req, res){
    var sessionID = req.params.sessionID;
    var avatar = req.params.avatar;
    var name = req.params.name;
    var message = req.params.message;
    console.log("Params: ", req.params);
    db.addMsgs(message, name, avatar, sessionID, res);
});


main.app.post('/dashboard-prof', function(req, res){
    var sessionID = req.body.sessionID;
    var className = req.body.idClass;
    console.log('-------sessionID: ', sessionID);
    db.refreshDashProf(sessionID, className, res);
});

// Refresh student dashboard
main.app.post('/dashboard-student', function(req, res){
    var sessionID = req.body.sessionID;
    var className = req.body.idClass;
    db.refreshDashStudent(sessionID, className, res);
});

main.app.post("/post-rating", function(req, res){
    var sessionID = req.body.sessionID;
    var rating = req.body.rating;
    console.log(rating);
    res.status(200).send({
        "error": 0,
        "Message": "The rating is " + rating
    })
    // db.refreshDashStudent(sessionID, className, res);
});



// Update action in db (called when user clicks an action button)
main.app.post('/post-action', function(req, res){
    var action = req.body.action;
    var sessionID = req.body.sessionID;
    db.addAction(action, sessionID, res);
});

main.app.post('/post-create-class', function(req, res){
    var className = req.body.className;
    var user = req.body.user;
    var idClass = className.replace(/\s/g, '');
    var sessionID = req.body.sessionID; // Only for student (else '')
    console.log("User: ", user);
    console.log("Class Name: ", className);
    if (user === 'prof'){
        // db.createClass(className, user, res);
        main.classNameLast = className;
        db.createSession(className, idClass, res);
    } else{
        main.sessionIDLast = sessionID;
        main.classNameLast = className;
        db.refreshDashStudent(sessionID, className, res);
    }
});

// Create a session id for a class (can only be done by professor)
main.app.post('/post-create-class-session', function(req, res){
    var className = req.body.className;
    var idClass = req.body.idClass;
    db.createSession(className, idClass, res);
});

main.app.post('/post-message', function(req, res){
    var message = req.body.message;
    var idClass = req.body.idClass;
    var sender = req.body.sender;
    var avatar = req.body.avatar;
    db.addMessage(message, idClass, sender, avatar, res);
});

main.app.post('/post-update-record', function(req, res){
    var newStatus= req.body.newStatus;
    var idClass = req.body.idClass;
    db.updateRecordStatus(newStatus, idClass, res);
});

main.app.listen(7000, function () {
    console.log('Example app listening on 7000');
});

