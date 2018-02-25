$(document).ready(function() {
    console.log("login.js attached");
    $("#login-btn").on('click', function(){
        console.log("Login button clicked");
        var className = $("#className").val(); // Get class id
        var user = 'student'; // Get type of user
        if (document.getElementById("prof").checked && !document.getElementById("student").checked){
            user = 'prof';
        }
        $.ajax({
            method: "POST",
            url: "/post-create-class",
            data: {
                className: className,
                user: user
            },
            success: function(data){
                console.log("Successfully created a class")
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



