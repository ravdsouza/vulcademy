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
  res.sendFile(main.path.join(__dirname, 'public/index_prof.html'));
});

// Retrieves the count of the action buttons
main.app.get('/get-action', function(req, res){
    // Retrieve count of actions from DB
});
main.app.get('/get-updated-actions', function(req, res){
    // Called by a db function
    var slowDownCount = 5;
    var speedUpCount = 6;
    var louderCount = 8;
    var quieterCount = 2;
    var slowDownPercent = parseInt(slowDownCount/(slowDownCount + speedUpCount) * 100);
    var speedUpPercent = parseInt(speedUpCount/(slowDownCount + speedUpCount) * 100);
    var louderPercent = parseInt(louderCount/(louderCount + quieterCount) * 100);
    var quieterPercent = parseInt(quieterCount/(quieterCount + louderCount) * 100);
    res.render('index_prof', {
        slowDownCount: slowDownCount,
        slowDownPercent: slowDownPercent, 
        speedUpCount: speedUpCount,
        speedUpPercent: speedUpPercent,
        louderCount: louderCount,
        louderPercent: louderPercent,
        quieterCount: quieterCount,
        quieterPercent: quieterPercent
    });
}); 


// Update action in db (called when user clicks an action button)
main.app.post('/post-action', function(req, res){
    var action = req.body.action;
    var sessionID = req.body.sessionID;
    main.addAction(action, sessionID, res);
});

main.app.post('/post-create-class', function(req, res){
    var className = req.body.className;
    db.createClass(className,res);
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
    db.addMessage(message, idClass, sender, res);
});

main.app.listen(7000, function () {
    console.log('Example app listening on 7000');
});

