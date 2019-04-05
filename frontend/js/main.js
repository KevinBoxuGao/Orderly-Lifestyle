$(function(){
  //login
  var userIdToken = null;
  function configureFirebaseLogin() {  
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var name = user.displayName;
        var welcomeName = name ? name : user.email;

        user.getIdToken().then(function(idToken) {
          userIdToken = idToken;
        });

      } else {
        userIdToken = null;
        window.location.replace("login.html");
      }
    });
  }  

  function logOut(){
    firebase.auth().signOut();
    window.location.replace("login.html");
  }

  //get backend data
  var backendHostUrl = 'http://127.0.0.1:5500/';
  function fetchTasks() {
    $.ajax(backendHostUrl + '/Tasks', {
      /* Set header for the XMLHttpRequest to get data from the web server
      associated with userIdToken */
      headers: {
        'Authorization': 'Bearer ' + userIdToken
      }
    }).then(function(data){
      $('.tasks').empty();

      data.forEach(function(task){
        $('.tasks').append(
          $('<div/>', {'class': 'task'}).append(
            $('<div/>', {'class': 'content'}).append(
              $('<button/>', {text: task.message})
              .append($('<h2/>', {text: task.message}))
            )
          )
          
          
          .text(note.message)
          
        );

      });
    });
  }

  configureFirebaseLogin();
});

