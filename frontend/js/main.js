$(function(){
  var backendHostUrl = "http://localhost:8081";
  
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
    $.ajax(backendHostUrl + '/user', { 
      /* Set header for the XMLHttpRequest to get data from the web server
      associated with userIdToken */
      headers: {
        'Authorization': 'Bearer ' + userIdToken,
        'Access-Control-Allow-Origin': '*'
      }
    }).then(function(data){
      $('.tasks').empty();
      
      data.forEach(function(task){
        $('.tasks').append(
          $('<div/>', {'class': 'task'}).append(
            $('<div/>', {'class': 'content'}).append(
              $('<button/>', {'class': 'button'}).append($('<div/>', {'class': 'check-box'})),
              $('<h2/>', {'class':'name'}).text(task)
            )
          )
        )
      }); 
      $('.tasks').append(
        $('<div/>', {'class': 'task add-task'}).append(
          $('<button/>', {'class': 'button'}).append(
            $('<i/>', {'class': 'fas fa-plus'}),
            $('<h2/>').text('Add Task')
          )
        )
      );

              
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

