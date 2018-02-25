$(document).ready(function() {
    console.log("dash-student.js attached");

    document.getElementById("refresh-btn").addEventListener("click", function(){
        var className = $("#classID").text();
        var sessionID = $("#sessionID").text();
        $.ajax({
            method: "POST",
            url: "/dashboard-student",
            data: {
                idClass: className,
                sessionID: sessionID
            },
            success: function(data){
                console.log("Successfully refreshed student dashboard")
            },
            error: function(){
                console.log("Error on refreshing student dashboard");
            }
        });
    });

    document.getElementById("faster-btn").addEventListener("click", function(){
        console.log("Clicked faster-btn button");
        var sessionID = $("#sessionID").text();
        $.ajax({
            method: "GET",
            url: "/get-action/speedUp/" + sessionID,
            success: function(data){
                console.log("Successfully updated action to DB")
            },
            error: function(){
                console.log("Error updating action to DB");
            }
        });
    });

    document.getElementById("slower-btn").addEventListener("click", function(){
        console.log("Clicked slower-btn button");
        var sessionID = $("#sessionID").text();
        console.log("Sending to post-action");
        $.ajax({
            method: "GET",
            url: "/get-action/slowDown/" + sessionID,
            success: function(data){
                console.log("Successfully updated action to DB")
            },
            error: function(){
                console.log("Error updating action to DB");
            }
        });
    });

    document.getElementById("louder-btn").addEventListener("click", function(){
        console.log("Clicked louder-btn button");
        var sessionID = $("#sessionID").text();
        console.log("Sending to post-action");
        $.ajax({
            method: "GET",
            url: "/get-action/louder/" + sessionID,
            success: function(data){
                console.log("Successfully updated action to DB")
            },
            error: function(){
                console.log("Error updating action to DB");
            }
        });
    });

    document.getElementById("quieter-btn").addEventListener("click", function(){
        console.log("Clicked quieter-btn button");
        var className = $("#classID").text();
        var sessionID = $("#sessionID").text();
        console.log("Sending to post-action");
        $.ajax({
            method: "GET",
            url: "/get-action/quieter/" + sessionID,
            success: function(data){
                console.log("Successfully updated action to DB")
            },
            error: function(){
                console.log("Error updating action to DB");
            }
        });
    });



    // $("#faster-btn").on('click', function(){
    //     // // Get class id
    //     var classID = $("#classID").text();
    //     $.ajax({
    //         method: "POST",
    //         url: "/post-action",
    //         data: {
    //             action: "speedUp",
    //             sessionID: classID
    //         },
    //         success: function(data){
    //             console.log("Successfully updated action to DB")
    //         },
    //         error: function(){
    //             console.log("Error updating action to DB");
    //         }
    //     });
    // });

    // $("#slower-btn").on('click', function(){
    //     // // Get class id
    //     var classID = $("#classID").text();
    //     $.ajax({
    //         method: "POST",
    //         url: "/post-action",
    //         data: {
    //             action: "slowDown",
    //             sessionID: classID
    //         },
    //         success: function(data){
    //             console.log("Successfully updated action to DB")
    //         },
    //         error: function(){
    //             console.log("Error updating action to DB");
    //         }
    //     });
    // });

    // $("#louder-btn").on('click', function(){
    //     // // Get class id
    //     var classID = $("#classID").text();
    //     $.ajax({
    //         method: "POST",
    //         url: "/post-action",
    //         data: {
    //             action: "louder",
    //             sessionID: classID
    //         },
    //         success: function(data){
    //             console.log("Successfully updated action to DB")
    //         },
    //         error: function(){
    //             console.log("Error updating action to DB");
    //         }
    //     });
    // });

    // $("#quieter-btn").on('click', function(){
    //     // // Get class id
    //     var classID = $("#classID").text();
    //     $.ajax({
    //         method: "POST",
    //         url: "/post-action",
    //         data: {
    //             action: "quieter",
    //             sessionID: classID
    //         },
    //         success: function(data){
    //             console.log("Successfully updated action to DB")
    //         },
    //         error: function(){
    //             console.log("Error updating action to DB");
    //         }
    //     });
    // });
});