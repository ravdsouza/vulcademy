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
    var sessionID = 'zbueypabzq';
    db.refreshDashProf(sessionID, res);
});

// Refresh student dashboard
main.app.get('/dashboard-student', function(req, res){
    res.render('index_student')
    // db.refreshDashStudent(res);
});

main.app.get('/record', function(req, res){
    res.render('record');
});

// main.app.get('/update-dashboard-prof', function(req, res){ // Change to post
//     db.refreshDashProf(res);
// }); 

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
    if (user === 'prof'){
        // db.createClass(className, user, res);
        db.createSession(className, idClass, res);
    } else{
        res.status(200).send({
            'error': 0,
            'Message': "User is a student"
        });
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
})


main.app.listen(7000, function () {
    console.log('Example app listening on 7000');
});

