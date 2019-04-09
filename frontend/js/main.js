$(function(){
  var backendHostUrl = "https://backend-dot-orderly-life.appspot.com/";
  
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
    $.ajax(backendHostUrl + '/accountdata', { 
      /* Set header for the XMLHttpRequest to get data from the web server
      associated with userIdToken */
      headers: {
        'Authorization': 'Bearer ' + userIdToken,
        'Access-Control-Allow-Origin': '*'
      }

    }).then(function(data){
      $('.actualTasks').empty();
      
      data.forEach(function(task, i){
        $('.actualTasks').append(
          $('<div/>', {'class': 'element'}).append(
            $('<div/>', {'class': 'check'}).append(
              $('<button/>', {'class': 'button'}).append(
                $("<input/>", {'type': 'checkbox', 'class': 'check-box', 'id': 'check-box'+i.toString(), 'val': task}))), 
              
            $('<div/>', {'class': 'task'}).append(
              $('<div/>', {'class': 'content'}).append(
                $('<h2/>', {'class':'name', 'id':'task-content'}).text(task)))
          )
        )
      }); 

    });
  }

  //function register() {
  //  $.ajax(backendHostUrl + '/register', {
  //    headers: {
  //      'Authorization': 'Bearer ' + userIdToken,
  //      'Access-Control-Allow-Origin': '*'
  //    },
  //    method: 'POST',
  //    data: JSON.stringify({'empty' : 'header'}),
  //    contentType : 'application/json'
  //  }).then(function(){
  //    fetchTasks();
  //  });  
  //}
  
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
  //var deleteTaskBtn = $('#delete-tasks');
  //deleteTaskBtn.click(function(event) {
  //  tasks = []
  //  
  //  event.preventDefault();
  //  $('.check-box').each(function(i, obj) {
  //    if($('#check-box' + i).is(":checked")) {
  //      tasks.push($('#check-box' + i).val());
  //    }
  //  });

  //  //send task to backend, store in databse with userIdToken
  //  $.ajax(backendHostUrl + '/delete', {
  //    headers: {
  //      'Authorization': 'Bearer ' + userIdToken,
  //      'Access-Control-Allow-Origin': '*'
  //    },
  //    
  //    data: JSON.stringify(tasks),
  //    contentType : 'application/json'
  //    
  //  }).then(function(){
  //    fetchTasks();
  //  });
  //});

  configureFirebaseLogin();
});

