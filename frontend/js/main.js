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
  
function updateTime() {
    var date = time().join(", ")
    $("#header__date").html(date);
}

function openNav() {
    document.getElementById("side-bar").style.width = "300px";
    document.getElementById("header__buttons").style.right = "320px";
    document.getElementById("header__buttons").style.transition = "0.4s";
}

function closeNav() {
    document.getElementById("side-bar").style.width = "0px";
    document.getElementById("header__buttons").style.right = "20px";
    document.getElementById("header__buttons").style.transition = "0.4s";
}

function openAddTaskForm() {
    document.getElementById("add-task__form").style.display = "block";
}

function closeAddTaskForm() {
    document.getElementById("add-task__form").style.display = "none";
}

let length = 0;
function populateNavWithSettings() {
    var div = document.createElement("DIV");
    var sign = document.createElement("A");
    var text = document.createTextNode("Sign Out");

    sign.appendChild(text);
    div.appendChild(sign);
    div.setAttribute("id", "signout");
    sign.setAttribute("class", "signout");
    sign.setAttribute("onclick", "logOut()");
    
    if ($("#side-bar").width != 0) {
        openNav();
    }
    openNav();
    //remove details of tasks
    if (length == 3) {
        var title = document.getElementById("title");
        var details = document.getElementById("details");
        var notes = document.getElementById("extraNotes");
        document.getElementById("side-bar").removeChild(title);
        document.getElementById("side-bar").removeChild(details);
        document.getElementById("side-bar").removeChild(notes);
        length = length - 3;
    }

    if (length == 0) {
        document.getElementById("side-bar").appendChild(div);
        length = length + 1;
    }
}

function populateNavWithTask(name, date, location, notes) {
    //title
    var titleDiv = document.createElement("DIV");
    var titleH = document.createElement("H1");
    var titleContent = document.createTextNode(name);
    //details
    var detailsDiv = document.createElement("DIV");
    var locationP = document.createElement("P");
    var locationContent = document.createTextNode("Location: " + location);
    var dateP = document.createElement("P");
    var dateContent = document.createTextNode("Date: "+date);
    //notes
    var extraNotesDiv = document.createElement("DIV");
    var extraNotesP = document.createElement("P");
    var extraNotesContent = document.createTextNode(notes);
    
    //title
    titleH.appendChild(titleContent);
    titleDiv.appendChild(titleH);
    titleDiv.setAttribute("id", "title");
    //details
    locationP.appendChild(locationContent);
    dateP.appendChild(dateContent);
    detailsDiv.appendChild(locationP);
    detailsDiv.appendChild(dateP);
    detailsDiv.setAttribute("id", "details");
    //notes
    extraNotesP.appendChild(extraNotesContent);
    extraNotesDiv.appendChild(extraNotesP);
    extraNotesDiv.setAttribute("id", "extraNotes");

    //remove sign out link
    if (length == 1) {
        var sign = document.getElementById("signout");
        document.getElementById("side-bar").removeChild(sign);
        length = length - 1;
    }
    //remove details of other tasks
    else if (length == 3) {
        var title = document.getElementById("title");
        var details = document.getElementById("details");
        var extraNotes = document.getElementById("extraNotes");
        document.getElementById("side-bar").removeChild(title);
        document.getElementById("side-bar").removeChild(details);
        document.getElementById("side-bar").removeChild(extraNotes);
        length = length - 3;
    }

    if (length == 0) {
        document.getElementById("side-bar").appendChild(titleDiv);
        document.getElementById("side-bar").appendChild(detailsDiv);
        document.getElementById("side-bar").appendChild(extraNotesDiv);
        length = length + 3;
    }
}

$(function(){
    var backendHostUrl = "https://backend-dot-orderly-lifestyle.appspot.com";
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
                window.location.replace("signin.html");
            }
        });
    }  
    
    //get backend data
    function fetchTasks() {
        $.ajax(backendHostUrl + '/tasks', { 
            // Set header for the XMLHttpRequest to get data from the web server associated with userIdToken 
            headers: {
              'Authorization': 'Bearer ' + userIdToken,
              'Access-Control-Allow-Origin': '*'
            }

        }).then(function(data){
            $('.tasks').empty();
            data.forEach(function(task, taskNumber){
                $('.tasks').append(
                    $('<div/>', {'class': 'task'}).append(
                    $('<a/>', {'class': 'clickable-area'}), 
                    $('<div/>', {'class': 'task__container'}).append(
                        $("<input>", {'type': 'checkbox', 'id': 'task'+taskNumber.toString(), 'class':'css-checkbox'}),
                        $('<label/>', {'for': 'task'+taskNumber.toString(), 'id': task['id'], 'class': 'css-label', 'date': task['date'], 'location': task['location'], 'notes': task['note']}).text(task['task']))
                    )
                )
            }); 
        });
    }

    //add task
    var saveTaskBtn = $('.save-task')
    saveTaskBtn.click(function(event) {
        event.preventDefault();

        closeAddTaskForm()
        var taskField = $('#task');
        var task = taskField.val();

        var dateField = $('#date');
        var date = dateField.val();

        var locationField = $('#location');
        var location = locationField.val();

        var noteField = $('#note');
        var note = noteField.val();
    
        //send task to backend, store in database with userIdToken
        $.ajax(backendHostUrl + '/tasks', {
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
    $(document).on('click', ".css-checkbox", function () {
        if ($(this).is(":checked")) {
            var id = $("[for=" + this.id + "]").attr("id");
            //send task information to backend for deleting
            $.ajax(backendHostUrl + '/removetasks', {
                headers: {
                    'Authorization': 'Bearer ' + userIdToken,
                    'Access-Control-Allow-Origin': '*'
                },
                method: 'POST',
                data: JSON.stringify({'id': id}),
                contentType : 'application/json'
            }).then(function(){
                fetchTasks();
            }); 
        }
    });

    //event when task is clicked to show extra details
    $(document).on('click', ".tasks .task .clickable-area", function () {
        var taskNumber = $(this).next().find("input").attr('id');
        var name = $("[for=" + taskNumber + "]").text();
        var date = $("[for=" + taskNumber + "]").attr("date");
        var location = $("[for=" + taskNumber + "]").attr("location");    
        var notes = $("[for=" + taskNumber + "]").attr("notes");
        openNav();
        populateNavWithTask(name, date, location, notes);
    });

    updateTime();
    $("#greeting").html(greeting());
    //change greeting on different screen size
    $(window).resize(function(){     
        if ($('html').width() <= 700){
            $("#greeting").html("My Day");
        } 
    });
    window.setInterval(updateTime, 10000);
    configureFirebaseLogin();
});

//sign out
function logOut(){
    firebase.auth().signOut().then(function() {
        console.log("Sign out successful");
        window.location.replace("signin.html");
    }, function(error) {
        console.log(error);
    });
}
