$(document).ready(function() {
    console.log("login.js attached");
    $("#login-btn").on('click', function(){
        console.log("Login button clicked");
        var className = $("#className").val(); // Get class id
        var user = 'student'; // Get type of user
        if (document.getElementById("prof").checked && !document.getElementById("student").checked){
            user = 'prof';
        }
        var sessionID = ''; // Session ID
        if (document.getElementById("student").checked){ sessionID = $("#sessionID").val(); }
        $.ajax({
            method: "POST",
            url: "/post-create-class",
            data: {
                className: className,
                user: user,
                sessionID: sessionID
            },
            success: function(data){
                console.log("Successfully created a class session");
                location.pathname = "/dashboard-prof";
            },
            error: function(){
                console.log("Error creating a class");
            }
        });
    });

    function test(){
        console.log("Called test");
    }
});



