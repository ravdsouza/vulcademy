document.getElementsByTagName("head")[0].innerHTML += "<link href='bootstrap-3.3.7-dist/css/bootstrap-theme.min.css' rel='stylesheet'><link href='bootstrap-3.3.7-dist/css/bootstrap.min.css' rel='stylesheet'>";

// add area to html with id poll
var poll = document.getElementsById("poll");

var question = document.getElementsByClassName("poll-q");
var options1 = document.getElementsByClassName("poll-op1")
var options2 = document.getElementsByClassName("poll-op2")
var options3 = document.getElementsByClassName("poll-op3")
var options4 = document.getElementsByClassName("poll-op4")

for (i = 0; i < question.length(); i++)
{
    document.getElementById("poll-q").innerHTML(question[i]);
    
    var formText = "";

    document.getElementById("poll-op").innerHTML(`
        <form>` 
            + options1[0] + 
        `</form>
   `)
}