function greeting() {
  var greetings = ["Good Morning, What Will Your Day Look Like?", "Feeling Tired? Don't Stop Now.", "Today Is A New Chance, Use It."];
  greeting = greetings[Math.floor(Math.random() * greetings.length)];
  return greeting;
}

function time() {
  var d = new Date();
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var date = [4];

  var hour = d.getHours();
  var minute = d.getMinutes();
  var z = "am"

  if (hour >= 12) {
      z = "pm";
  }

  if (hour > 12) {
      hour -= 12;
  }

  minute = checkTime(minute);

  date[0] = weekday[d.getDay()]
  date[1] = month[d.getMonth()] + " " + d.getDate();
  date[2] = d.getFullYear();
  date[3] = hour + ":" + minute +  " " + z;

  return date;

  function checkTime(i) {
      if (i < 10) { i = "0" + i };
      return i;
  }
}


$(function(){
  $(".greeting").html(greeting());
  $(".date").html(time().join(", "));

  var uid = null;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        uid = user.uid;
      } else {
        uid = null;
          window.location.replace("login.html");
      }
    });
    
    function logOut(){
      firebase.auth().signOut();
    }
});

