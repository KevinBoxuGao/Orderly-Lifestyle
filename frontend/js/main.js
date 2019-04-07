$(function(){
  var backendHostUrl = "localhost:8081";
  
  //login
  var userIdToken = null;
  function configureFirebaseLogin() {  
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var name = user.displayName;
        var welcomeName = name ? name : user.email;

        user.getIdToken().then(function(idToken) {
          userIdToken = idToken;
          fetchTasks();
        });

      } else {
        userIdToken = null;
        window.location.replace("login.html");
      }
    });
  }  

  //sign out
  function logOut(){
    firebase.auth().signOut().then(function() {
      console.log("Sign out successful");
      window.location.replace("login.html");
    }, function(error) {
      console.log(error);
    });
  }

  //get backend data
  function fetchTasks() {
    $.ajax({
      url: backendHostUrl +'/users',
      crossOrigin: true,
      /* Set header for the XMLHttpRequest to get data from the web server
      associated with userIdToken */
      headers: {
        'Authorization': 'Bearer ' + userIdToken,
        'Access-Control-Allow-Origin': '*'
      }
    }).then(function(data){
      console.log(date);

      $('.tasks').empty();
      data.forEach(function(task){
        $('.tasks').append(
          $('<div/>', {'class': 'task'}).append(
            $('<div/>', {'class': 'content'}).append(
              $('<button/>', {text: task.message})
              .append($('<h2/>', {text: task.message}))
            )
          )
        )
      });  
    });
  }

  ////add task
  //function addTask() {
  //  $.ajax({
  //    url: backendHostUrl +'/tasks',
  //    crossOrigin: true,
  //    /* Set header for the XMLHttpRequest to get data from the web server
  //    associated with userIdToken */
  //    headers: {
  //      'Authorization': 'Bearer ' + userIdToken,
  //      'Access-Control-Allow-Origin': '*'
  //    },
  //    method: 'POST',
  //    data: JSON.stringify({'message': note}),
  //    contentType : 'application/json'
  //  }).then(function(data){
  //    //refresh display
  //    fetchNotes();
  //  });
  //}
//
  ////delete task
  //function deleteTask() {
  //  $.ajax({
  //    url: backendHostUrl +'/tasks',
  //    crossOrigin: true,
  //    /* Set header for the XMLHttpRequest to get data from the web server
  //    associated with userIdToken */
  //    headers: {
  //      'Authorization': 'Bearer ' + userIdToken,
  //      'Access-Control-Allow-Origin': '*'
  //    },
  //    method: 'POST',
  //    data: JSON.stringify({'message': note}),
  //    contentType : 'application/json'
  //  }).then(function(data){
  //    //refresh display
  //    fetchNotes();
  //  });  
  //}

  configureFirebaseLogin();
});

