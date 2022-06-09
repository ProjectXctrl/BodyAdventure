var Timer = function(minutes,seconds) {


const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "August", "Sep", "Oct", "Nov", "Dec"];
const d = new Date();

let month = months[d.getMonth()];
let day = d.getDate();
let year = d.getFullYear();

let hour= d.getHours();
var minute= d.getMinutes()+minutes;
var second= d.getSeconds()+seconds;

let xMinutesLater=""+month+" "+day+", "+year+" "+hour+":"+minute+":"+second;    //sets a date x minutes later than now


// Set the date we're counting down to
var countDownDate = new Date(xMinutesLater).getTime();


// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    
  // Time calculations for minutes and seconds
 
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="time"
  document.getElementById("time").innerHTML = 
  minutes + "m " + seconds + "s";
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("time").innerHTML = "loading";
  }
}, 1000);

}
module.exports = Timer
