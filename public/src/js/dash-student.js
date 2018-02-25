$(document).ready(function() {
    console.log("dash-student.js attached");

    document.getElementById("refresh-btn").addEventListener("click", function(){
        var className = $("#classID").val();
        var sessionID = $("#sessionID").val();
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
        var className = $("#classID").val();
        var sessionID = $("#sessionID").val();
        console.log("Sending to post-action");
        $.ajax({
            method: "POST",
            url: "/post-action",
            data: {
                action: "speedUp",
                sessionID: sessionID
            },
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
    });

    document.getElementById("louder-btn").addEventListener("click", function(){
        console.log("Clicked louder-btn button");
    });

    document.getElementById("quieter-btn").addEventListener("click", function(){
        console.log("Clicked quieter-btn button");
    });



    // $("#faster-btn").on('click', function(){
    //     // // Get class id
    //     var classID = $("#classID").val();
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
    //     var classID = $("#classID").val();
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
    //     var classID = $("#classID").val();
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
    //     var classID = $("#classID").val();
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