var ToDo=angular.module('ToDo', ['ngCordova','ionic']);

ToDo.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '[]');
    }
  }
}]);

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

ToDo.controller('ToDoCtrl',function($scope, $localstorage, $ionicModal, $ionicListDelegate, $ionicPopup){
  function onStorageEvent(storageEvent){
    console.log(storageEvent);
    $scope.list=$localstorage.getObject("list");
  }

  window.addEventListener('storage', onStorageEvent, false);

  function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].text == obj.text) {
        return true;
      }
    }
    return false;
  }

  $ionicModal.fromTemplateUrl('templates/new.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.list=$localstorage.getObject("list");

  $scope.open=function(){
    $scope.item={};
    $scope.item.text="";
    $scope.item.tags=[{text:"Urgent", checked:false, class:"assertive"},
{text:"Important", checked:false, class:"positive"}];
    $scope.modal.show();
    $ionicListDelegate.closeOptionButtons();
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
      status: false,
      tags: chosenTags
    }
  }
  $scope.addItem=function(){
    var saveItem=Item($scope.item.text, $scope.item.tags);
    if (containsObject(saveItem, $scope.list)){
      var alertPopup = $ionicPopup.alert({
        title: 'Duplicate task'
      });
    }else{
      $scope.list.push(saveItem);
      $localstorage.setObject("list", $scope.list);
      $scope.modal.hide();
    }
  };
  $scope.completeItem=function(item){
    var index=$scope.list.indexOf(item);
    $scope.list[index].status=!$scope.list[index].status;
    $localstorage.setObject("list", $scope.list);
    $ionicListDelegate.closeOptionButtons();
  };
  $scope.deleteItem=function(item){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete task ?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        var index=$scope.list.indexOf(item);
        $scope.list.splice(index, 1);
        $localstorage.setObject("list", $scope.list);
        $ionicListDelegate.closeOptionButtons();
      }
    });
  }
});
