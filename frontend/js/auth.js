$(function(){
    var config = {
        apiKey: "AIzaSyAB5gvYSeK8U4KSKlBcPRADDVyWi4dLsMg",
        authDomain: "orderly-life.firebaseapp.com",
        databaseURL: "https://orderly-life.firebaseio.com",
        projectId: "orderly-life",
        storageBucket: "orderly-life.appspot.com",
        messagingSenderId: "957471703508"
    };
    firebase.initializeApp(config);
    
    
    
    var uiConfig = {
        signInSuccessUrl: '<url-to-redirect-to-on-success>',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
 
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
          window.location.assign('<your-privacy-policy-url>');
        }
      };

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
});  