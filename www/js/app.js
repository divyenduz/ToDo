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

ToDo.controller('ToDoCtrl',function($scope, $ionicModal){
  $ionicModal.fromTemplateUrl('templates/new.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.list=[{
    text: "Gig text",
    tags: ["Red", "Blue"]
  },{
    text: "Gig text",
    tags: ["Red"]
  },{
    text: "Gig text",
    tags: ["Blue"]
  },
  {
    text: "Gig text",
    tags: []
  }];

  $scope.open=function(){
    $scope.item={};
    $scope.item.text="";
    $scope.item.tags=[{text:"Urgent", checked:false, class:"assertive"},
{text:"Important", checked:false, class:"positive"}];
    $scope.modal.show();
  };
  $scope.close=function(){
    $scope.modal.hide();
  };
  var Item = function(text, tags){
    var chosenTags=[]
    for(i in tags){
      tag=tags[i];
      if(tag.hasOwnProperty("checked")){
        if(tag.checked==true){
          chosenTags.push(tag.text);
        }
      }
    }
    return {
      text: text,
      tags: chosenTags
    }
  }
  $scope.addItem=function(){
    $scope.list.push(Item($scope.item.text, $scope.item.tags));
    $scope.modal.hide();
  };
});
