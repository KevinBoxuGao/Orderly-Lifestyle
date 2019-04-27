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
          register();
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
    $.ajax(backendHostUrl + '/accountdata', { 
      /* Set header for the XMLHttpRequest to get data from the web server
      associated with userIdToken */
      headers: {
        'Authorization': 'Bearer ' + userIdToken,
        'Access-Control-Allow-Origin': '*'
      }

    }).then(function(data){
      $('.tasks').empty();
      
      data.forEach(function(task, taskNumber){
        $('.tasks').append(
          $('<div/>', {'class': 'task'}).append(
            $('a/>', {'class': 'clickable-area'}), 
            $('<div/>', {'class': 'task'}).append(
                $("<input>", {'type': 'checkbox', 'id': 'task'+taskNumber.toString(), 'class':'css-checkbox'}),
                $('<label/>', {'class': 'css-label', 'date': task[1], 'location': task[2], 'notes': task[3]}).text(task[0])
            )
          )
        )
      }); 
    });
  }

  function register() {
    $.ajax(backendHostUrl + '/register', {
      headers: {
        'Authorization': 'Bearer ' + userIdToken,
        'Access-Control-Allow-Origin': '*'
      },
      method: 'POST',
      data: JSON.stringify({'empty' : 'header'}),
      contentType : 'application/json'
    }).then(function(){
      fetchTasks();
    });  
  }
  
  //add task
  var saveTaskBtn = $('#save-task')
  saveTaskBtn.click(function(event) {
    event.preventDefault();

    var taskField = $('#task');
    var task = taskField.val();
    taskField.val("");

    var dateField = $('#date');
    var date = dateField.val();
    dateField.val("");

    var locationField = $('#location');
    var location = locationField.val();
    locationField.val("");

    var noteField = $('#note');
    var note = taskField.val();
    noteField.val("");
    
    console.log(task);



    //send task to backend, store in databse with userIdToken
    $.ajax(backendHostUrl + '/accountdata', {
      headers: {
        'Authorization': 'Bearer ' + userIdToken,
        'Access-Control-Allow-Origin': '*'
      },
      method: 'POST',
      data: JSON.stringify({'task' : task, 'date' : date, 'location': location, 'note' : note}),
      contentType : 'application/json'
    }).then(function(){
      fetchTasks();
    });
  });

  //delete task
  //var deleteTaskBtn = $('#delete-task')
  //deleteTaskBtn.click(function(event) {
  //  event.preventDefault();
//
  //  var taskField = $('#task-content');
  //  var task = taskField.val();
  //  taskField.val("");
  //  
  //  //send task to backend, store in databse with userIdToken
  //  $.ajax(backendHostUrl + '/removetasks', {
  //    headers: {
  //      'Authorization': 'Bearer ' + userIdToken,
  //      'Access-Control-Allow-Origin': '*'
  //    },
  //    method: 'POST',
  //    data: JSON.stringify({'task' : task}),
  //    contentType : 'application/json'
  //  }).then(function(){
  //    getTasks();
  //  });
  //});

  configureFirebaseLogin();
});