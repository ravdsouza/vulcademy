$(document).ready(function() {
    console.log("dash-prof.js attached");

    $("#switch").on('click', function(){
        var newStatus = "false";
        $("#switch").toggleClass('disabled');
        // Check what state the switch is in
        if (!($("#switch").hasClass('disabled'))){ // If changed to enabled
            newStatus = "true";
            console.log("Now enabled");
            $("#record-status").html("Disable Lecture Recording");
        } else{
            console.log("Now disabled");
            $("#record-status").html("Enable Lecture Recording");
        }
        console.log("Hello World");
        // Get class id
        var classID = $("#classID").val();
        console.log("classID(client): ", classID);
        $.ajax({
            method: "POST",
            url: "/post-update-record",
            data: {
                newStatus: newStatus,
                idClass: classID
            },
            success: function(data){
                console.log("Successfully updated recording status")
            },
            error: function(){
                console.log("Error updating recording status");
            }
        });
    });
});