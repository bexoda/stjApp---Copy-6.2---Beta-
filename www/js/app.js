// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform, $cordovaPush, $rootScope) {
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

     var androidConfig = {"senderID": "178795267753"};

     $cordovaPush.register(androidConfig).then(function(result){
        /*alert(result);*/
    },function(err){
        alert(err);
      })

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('main',{
    url: '/main',
    templateUrl: 'templates/menu.html',
    controller: 'MenuCtrl'

    })

  $stateProvider
  .state('main.contentRecent',{
    url: '/contentRecent',
    templateUrl: 'templates/menuContent.html',
    controller: 'MainCtrl'

    })
  
  $stateProvider
  .state('main.postDetail',{
    url: '/postDetail/:postId',
    templateUrl: 'templates/postDetail.html',
    controller: 'PostCtrl'

  })

  $stateProvider
  .state('main.aboutUs',{
    url: '/aboutUs',
    templateUrl: 'templates/postDetail.html',
    controller: 'AboutUs'

  })


  $stateProvider
  .state('main.contentOfCat',{
    url: '/contentOfCat/:slugName',
    templateUrl: 'templates/contentOfCat.html',
    controller: 'CatCtrl'
  });



  $urlRouterProvider.otherwise('/main/contentRecent');

})
