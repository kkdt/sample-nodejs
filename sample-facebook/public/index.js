/**
 * The module that wraps common function for testing out the Facebook API.
 */
var SampleFacebookLogin = function(appId, sdkVersion) {
   /**
    * Update the 'status' div.
    */
   var statusChanged = function(status) {
      document.getElementById('status').innerHTML = status;
   }

   /**
    * Update the 'user' information div.
    */
   var userChanged = function(info) {
      document.getElementById('user').innerHTML = status;
   }

   /*
    * Handle an authentication response.
    */
   var handleAuthentication = function(response) {
      if (response.status === 'connected') {
         var uid = response.authResponse.userID;
         var accessToken = response.authResponse.accessToken;
         var expiresIn = response.authResponse.expiresIn
         var signedRequest = response.authResponse.signedRequest

         var status = '<br/>uid: ' + uid;
         status += '<br/>accessToken: ' + accessToken;
         status += '<br/>expiresIn: ' + expiresIn;
         status += '<br/>signedRequest: ' + signedRequest;
         statusChanged(status);

         displayUserInfo();
      } else if (response.status === 'not_authorized') {
         statusChanged('<br/>Not authorized');
         userChanged('');
      } else {
         statusChanged('<br/>Please log into the application.')
         userChanged('');
      }
   };

   /**
    * Delegates to the FB api.
    */
   var getLoginStatus = function() {
      FB.getLoginStatus(function(response) {
         handleAuthentication(response);
      });
   }

   /*
    * Initialization block.
    */
   var init = function() {
      console.log('initializing facebook appId: ' + appId + ', version: ' + sdkVersion)
      FB.init({
        appId      : appId,
        cookie     : true,
        xfbml      : true,
        version    : sdkVersion
      });
      getLoginStatus();
   };

   /**
    * Invoke the API call to get the currently logged-in user and display their data.
    */
   var displayUserInfo = function() {
      FB.api('/me', 'get', {fields:'id,email,name'}, function(response) {
         console.log('Successful login for: ' + response.name);
         var msg = '<p>Thanks for logging in, ' + response.name + '!</p>'
            + '<p>userID: '+ response.id + '</p>'
            + '<p>email: '+ response.email + '</p>';
         document.getElementById('user').innerHTML = msg;
      });
   }

   // define what are the exposed functionality
   return {
      init : init,
      getLoginStatus : getLoginStatus
   }
};

// -----------------------------------------------------------------------------
// Application entry
// Put your appId and SDK version below.
// i.e. SampleFacebookLogin('xxxxxxxxx','v2.4');

var driver = SampleFacebookLogin('CHANGEME','CHANGEME');
window.fbAsyncInit = driver.init;
