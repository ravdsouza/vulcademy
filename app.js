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
    console.log(sessionID);
    console.log(main.sessionIDLast);
    db.refreshDashProf(sessionID, res);
});

// Refresh student dashboard
main.app.get('/dashboard-student', function(req, res){
    console.log("Hello World");
    var sessionID = main.sessionIDLast;
    console.log("SessionID: ", sessionID);
    db.refreshDashStudent(sessionID, res);
});

main.app.get('/record', function(req, res){
    res.render('record');
});

// Update action in db (called when user clicks an action button)
main.app.post('/post-action', function(req, res){
    var action = req.body.action;
    var sessionID = req.body.sessionID;
    main.addAction(action, sessionID, res);
});

main.app.post('/post-create-class', function(req, res){
    var className = req.body.className;
    var user = req.body.user;
    var idClass = className.replace(/\s/g, '');
    var sessionID = req.body.sessionID; // Only for student (else '')
    console.log("User: ", user);
    if (user === 'prof'){
        // db.createClass(className, user, res);
        db.createSession(className, idClass, res);
    } else{
        console.log("Student");
        main.sessionIDLast = sessionID;
        res.status(200).render('index_student', {
            sessionID: sessionID,
            courseName: className
        });
        // db.refreshDashStudent(sessionID, res);
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

