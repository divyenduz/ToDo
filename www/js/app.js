// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ToDo=angular.module('ToDo', ['ngCordova','ionic']);

ToDo.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

ToDo.controller('ToDoCtrl',function($scope, $cordovaFlashlight){
  $scope.InitLoad=function(){

    $scope.flashState="ion-ios7-bolt-outline";

    $scope.ToDoList=[
    {
      "name": "Nothing to do",
      "icon": "ion-sad",
      "items":
      [{
        "item":"Add using +Add button"
      }]
    }];
  };

  $scope.toggleFlash=function(){
    $cordovaFlashlight.available().then(function(availability) {
      var avail = availability; // is available
      console.log("Availability:" + avail);
      $cordovaFlashlight.toggle().then(
        function (success) {
          if($scope.flashState==="ion-ios7-bolt-outline")
            $scope.flashState="ion-ios7-bolt";
          else
            $scope.flashState="ion-ios7-bolt-outline";
        },
        function (error) {
          console.log("Failed to switch flash state");
        });
    }, function () {
      console.log("Flash light not available");
    });
  };

  $scope.addItem=function(){
    ;
  };
});
