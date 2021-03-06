// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module("starter", ["ionic",'ionic.service.core', "firebase", "ngSanitize"]);  

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

app.controller('AppCtrl', function($scope, $ionicModal, $firebaseArray, $http, $ionicSideMenuDelegate, $sce) {
  
  $scope.nickname;
  var ref = new Firebase('https://juliansfirstapp.firebaseio.com/');
  
  $scope.records = $firebaseArray(ref);

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/modal2.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;
  });

  $ionicModal.fromTemplateUrl('templates/modal3.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal3 = modal;
  });

  $ionicModal.fromTemplateUrl('templates/modal4.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal4 = modal;
  });

  $ionicModal.fromTemplateUrl('templates/modal5.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal5 = modal;
  });

  
  $scope.sendMessage = function(u) {        
    $scope.records.$add({ Name: $('.tag').val(), Message: u.userMessage, Time: new Date().getTime() });
    $scope.modal.hide();
    u.userMessage = '';
  };

  $scope.sendMessage2 = function(u) {
    var search = $('#message2').val();
    $.ajax({url: "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + search, method: 'GET'})
    .done(function(response) {
      console.log(response) // the json object that came back from the api
      var randomImage = response.data.fixed_width_downsampled_url;
      
      
      $scope.records.$add({ Name: $('.tag').val(), Message2: randomImage, Time: new Date().getTime() });
    });        
    
    $scope.modal2.hide();
    
  };

  $scope.emptyChat = function() {
    ref.remove();
  };

   $scope.signUp = function(u) {        
    var username = u.username;
    var email = u.email;
    var password = u.password;
    //console.log(username, email, password);
    var data = {
      username: username,
      email: email
    };

    ref.createUser({
      email    : email,
      password : password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);

        $http.post('/signUp', data).then(function successCallback(response){
          console.log(response);
        }, function errorCallback(response){
          console.log(response);
        });
      }
    });

    $scope.modal.hide();
  };

  $scope.login = function(u) {        
    var email = u.email;
    var password = u.password;
    var data = {
      email: email
    };
    //console.log(email, password);
    ref.authWithPassword({
      email    : email,
      password : password
    }, function(error, authData) {
      if (error) {
        //console.log("Login Failed!", error);
        return alert('Login failed, please try again');
      } else {
        console.log("Authenticated successfully with payload");

        $http.post('/login', data).then(function successCallback(response){
          console.log(response.data.username);
          location.href = '/main';
        }, function errorCallback(response){
          console.log(response);
        });
      }

    });

    $scope.modal2.hide();

  };

  $scope.retrieve = function() {
    $http({
      method: 'GET',
      url: '/retrieve'
    }).then(function successCallback(response) {
        //console.log(response);
        $scope.nickname = response.data;
        $scope.username = $scope.nickname;
        //console.log($scope.nickname);
      }, function errorCallback(response) {
        console.log(response);
      });
  };

  $scope.toggleLeft = function(){
  	$ionicSideMenuDelegate.toggleLeft();
  }

  $scope.logOut = function(){
  	location.href = '/';
  }

  $scope.sendPicture = function() {
    var search = $('#message3').val();
         
    $scope.records.$add({ Name: $('.tag').val(), Message2: search, Time: new Date().getTime() });

    $scope.modal3.hide();
    
  };

  $scope.sendLink = function() {
  	var title = $('#website').val().toString();
    var search = $('#message4').val().toString();
    search = '<a href="' + search + '" target="_blank">' + title + '</a>';
    //search = $sce.trustAsResourceUrl(search);

    $scope.records.$add({ Name: $('.tag').val(), link: search, Time: new Date().getTime() });

    $scope.modal4.hide();
    

  };

  $scope.sendVideo = function() {
    var search = $('#message5').val().toString();
    search = search.replace("watch?v=", "v/");
    //search = $sce.trustAsResourceUrl(search);
         
    $scope.records.$add({ Name: $('.tag').val(), video: search, Time: new Date().getTime() });

    $scope.modal5.hide();
    
  };


});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
