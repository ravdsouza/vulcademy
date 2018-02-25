$(document).ready(function() {
    console.log("dash-prof.js attached");

    $("#switch").on('click', function(){
        var newStatus = "false";
        $("#switch").toggleClass('disabled');
        // Check what state the switch is in
        if (!($("#switch").hasClass('disabled'))){ // If changed to enabled
            newStatus = "true";
            $("#record-status").html("Disable Lecture Recording");
        } else{
            $("#record-status").html("Enable Lecture Recording");
        }
        // Get class id
        var classID = $("#classID").val();
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