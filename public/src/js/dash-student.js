$(document).ready(function() {
    console.log("dash-student.js attached");

    $("#faster-btn").on('click', function(){
        // // Get class id
        var classID = $("#classID").val();
        $.ajax({
            method: "POST",
            url: "/post-action",
            data: {
                action: "speedUp",
                sessionID: classID
            },
            success: function(data){
                console.log("Successfully updated action to DB")
            },
            error: function(){
                console.log("Error updating action to DB");
            }
        });
    });

    $("#slower-btn").on('click', function(){
        // // Get class id
        var classID = $("#classID").val();
        $.ajax({
            method: "POST",
            url: "/post-action",
            data: {
                action: "slowDown",
                sessionID: classID
            },
            success: function(data){
                console.log("Successfully updated action to DB")
            },
            error: function(){
                console.log("Error updating action to DB");
            }
        });
    });

    $("#louder-btn").on('click', function(){
        // // Get class id
        var classID = $("#classID").val();
        $.ajax({
            method: "POST",
            url: "/post-action",
            data: {
                action: "louder",
                sessionID: classID
            },
            success: function(data){
                console.log("Successfully updated action to DB")
            },
            error: function(){
                console.log("Error updating action to DB");
            }
        });
    });

    $("#quieter-btn").on('click', function(){
        // // Get class id
        var classID = $("#classID").val();
        $.ajax({
            method: "POST",
            url: "/post-action",
            data: {
                action: "quieter",
                sessionID: classID
            },
            success: function(data){
                console.log("Successfully updated action to DB")
            },
            error: function(){
                console.log("Error updating action to DB");
            }
        });
    });
});