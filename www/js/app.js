var ToDo=angular.module('ToDo', ['ionic', 'react']);

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
  };
}]);

ToDo.directive('oneItem', function(){
  return {
    templateUrl: "templates/directive_one_item.html"
  };
});

ToDo.run(function($ionicPlatform, $rootScope) {
  $rootScope.sequentialBackButtonPresses=0;
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(AdMob) {
      AdMob.createBanner({
        adId:"ca-app-pub-8214283480745188/9862147558",
        position:AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow:true
      });

      AdMob.prepareInterstitial({
        adId: "ca-app-pub-8214283480745188/2338880750",
        autoShow:false
      });
    }

    $ionicPlatform.registerBackButtonAction(function (e) {
      if($rootScope.sequentialBackButtonPresses === 1){
        console.log("Closing app");
        $rootScope.sequentialBackButtonPresses = 0;
        if(AdMob){
          AdMob.showInterstitial();
        }
        ionic.Platform.exitApp();
        return false;
      }
      else {
        console.log("Press again to close application");
        window.plugins.toast.showShortBottom("Press again to close application");
        $rootScope.sequentialBackButtonPresses++;
        e.preventDefault();
        return false;
      }
    }, 100);

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

ToDo.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('/', {
    url: '/',
    templateUrl: 'templates/dashboard.html'
  })

  // Not used right now
  .state('info', {
    url: '/info',
    templateUrl: 'templates/info.html'
  });
  $urlRouterProvider.otherwise('/');
});

ToDo.controller('ToDoCtrl',function($scope, $location, $localstorage, $ionicModal, $ionicListDelegate, $ionicPopup, $ionicSlideBoxDelegate){
  $scope.timerProps={
    createTime: "1423121154846",
    class: "timer-time"
  };

  function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].text == obj.text) {
        return true;
      }
    }
    return false;
  }

  $scope.logicSort=function(item){
    var factor=0;
    if(item.tags.length===1){
      if(item.tags[0]==="Urgent"){
        factor=-0.5;
      }else{
        factor=0.5;
      }
    }
    if(item.status===true){
      factor=-5;
    }
    return item.tags.length+factor;
  };

  $ionicModal.fromTemplateUrl('templates/new.html', {
    scope: $scope,
  }).then(function(modal) {
    $scope.addModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/info.html', {
    scope: $scope,
  }).then(function(modal) {
    $scope.informationModal = modal;
    $scope.firstRun=($localstorage.get("firstRun", "true") === "true");
    if($scope.firstRun===true){
      $scope.openInformationModal();
    }
  });

  $scope.list=$localstorage.getObject("list");

  $scope.openAddModal=function(){
    $scope.item={};
    $scope.item.text="";
    $scope.item.tags=[{text:"Urgent", checked:false, class:"assertive"},
    {text:"Important", checked:false, class:"positive"}];
    $scope.addModal.show();
    $ionicListDelegate.closeOptionButtons();
  };
  $scope.closeAddModal=function(){
    $scope.addModal.hide();
  };
  $scope.openInformationModal=function(){
    $scope.informationModal.show();
    $ionicSlideBoxDelegate.update();
    $ionicListDelegate.closeOptionButtons();
  };
  $scope.closeInformationModal=function(){
    $localstorage.set("firstRun", "false");
    $scope.firstRun=($localstorage.get("firstRun", "true") === "true");
    $scope.informationModal.hide();

  };
  var Item = function(text, tags){
    var chosenTags=[];
    for(var i in tags){
      tag=tags[i];
      if(tag.hasOwnProperty("checked")){
        if(tag.checked===true){
          chosenTags.push(tag.text);
        }
      }
    }
    return {
      text: text,
      status: false,
      tags: chosenTags,
      createTime: Date.now()
    };
  };
  $scope.addItem=function(){
    var saveItem=Item($scope.item.text.trim(), $scope.item.tags);
    if (containsObject(saveItem, $scope.list)){
      var alertPopup = $ionicPopup.alert({
        title: 'Duplicate task'
      });
    }else{
      $scope.list.unshift(saveItem);
      $localstorage.setObject("list", $scope.list);
      $scope.addModal.hide();
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
  };
});
