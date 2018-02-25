document.getElementsByTagName("head")[0].innerHTML += "<link href='bootstrap-3.3.7-dist/css/bootstrap-theme.min.css' rel='stylesheet'><link href='bootstrap-3.3.7-dist/css/bootstrap.min.css' rel='stylesheet'>";

// add area to html with id poll
var poll = document.getElementById("poll");

var question = document.getElementsByClassName("poll-q");
var options1 = document.getElementsByClassName("poll-op1")
var options2 = document.getElementsByClassName("poll-op2")
var options3 = document.getElementsByClassName("poll-op3")
var options4 = document.getElementsByClassName("poll-op4")

for (i = 0; i < question.length; i++)
{
    document.getElementById("poll-q").innerHTML(question[i]);
    
    var formText = "<form>" + options1[i] + `
    <input type="radio" name="vote" value="0" onclick="getVote(this.value)">
    <br> ` + options2[i] + `<input type="radio" 
    name="vote" value="1" onclick="getVote(this.value)">`;

    if (string(options3[i]) != "")
    {
        formText += `<br> ` + options3[i] + `<input type="radio" 
        name="vote" value="2" onclick="getVote(this.value)">`;
    }   
    if (string(options4[i]) != "")
    {
        formText += `<br> ` + options4[i] + `<input type="radio" 
        name="vote" value="3" onclick="getVote(this.value)">`;
    }

    poll.innerHTML(formText + "</form>");
}

function getVote(int) 
{
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
      } else {  // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.onreadystatechange=function() {
        if (this.readyState==4 && this.status==200) {
          document.getElementById("poll").innerHTML=this.responseText;
        }
      }
      xmlhttp.open("GET","poll_vote.php?vote="+int,true);
      xmlhttp.send();
}