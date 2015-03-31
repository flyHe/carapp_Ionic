
'use strict';

/*var options = {};
options.api = {};
options.api.base_url = "http://112.124.50.122/cargodispatch";*///var 定义全局变量
var app = angular.module('app', ['ionic','app.controllers','ui.router','app.services','ngCordova']);
/*app.constant('constanttest', {'api':{'base_url':"http://112.124.50.122/cargodispatch"}});  //constant定义全局变量,赋值后不能被改变
app.value('fooConfig', {config1: true,config2: "Default config2 but it can changes"}); //value定义全局变量，赋值后可以被改变
*/
app.value('options', {'api': {'base_url':"http://112.124.50.122/cargodispatch"}});
app.run(function($ionicPlatform) {
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
app.config(function($stateProvider, $urlRouterProvider) {
$stateProvider
         .state('app', {
           url: "/app",
           abstract: true,
           templateUrl: "views/menu.html",
           controller: 'moreCtrl'
  })
         .state('login',{
           url:'/login',
           templateUrl:'views/login.html',
           controller:'AdminUserCtrl'
        })
        
        .state('app.nTask',{
			url:'/nTask',
            views: {
                'menuContent' :{
                  templateUrl: "views/nTask.html",
                  controller: 'nTaskCtrl'
                }
              }
		})
		/*.state('app.nTaskDetail',{
			url:'/nTaskDetail',
			views: {
	                'menuContent' :{
            templateUrl:'views/nTaskDetail.html',
			controller:'nTaskDetailCtrl'
	                }
            }
		})*/
		.state('app.aTask',{
			url:'/aTask',
			views: {
                'menuContent' :{
            templateUrl:'views/aTask.html',
			controller:'aTaskCtrl'
                }
            }
		})
		/*.state('app.aTaskDetail',{
			url:'/aTaskDetail',
			views: {
                'menuContent' :{
            templateUrl:'views/aTaskDetail.html',
			controller:'aTaskDetailCtrl'
                }
            }
		})*/
		.state('app.hTask',{
			url:'/hTask',
			views: {
                'menuContent' :{
            templateUrl:'views/hTask.html',
			controller:'hTaskCtrl'
                }
            }
		})
		/*.state('app.hTaskDetail',{
			url:'/hTaskDetail',
			views: {
                'menuContent' :{
            templateUrl:'views/hTaskDetail.html',
			controller:'hTaskDetailCtrl'
                }
            }
		})*/
		.state('app.more',{
			url:'/more',
			views: {
                'menuContent' :{
            templateUrl:'views/more.html',
			controller:'moreCtrl'
                }
            }
		})
		.state('location',{
			url:'/location/:GPS',
            templateUrl:'views/location.html',
			controller:'locationCtrl'
		})
		.state('register',{
			url:'/register',
            templateUrl:'views/register.html',
			controller:'registerCtrl'
		})
        .state('userInfo',{
            url:'/userInfo',
            templateUrl:'views/userInfo.html',
            controller:'userInfoCtrl'
        })
        .state('selectTruck',{
            url:'/selectTruck',
            templateUrl:'views/selectTruck.html',
            controller:'selectTruckCtrl'
        })
        .state('changePassword',{
            url:'/changePassword',
            templateUrl:'views/changePassword.html',
            controller:'changePasswordCtrl'
        })
		 // 默认路由
        $urlRouterProvider.otherwise('/app/nTask');
});



app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
}]);

app.run(['$rootScope', '$window', '$location', '$log','AuthenticationService','PopupService','$cordovaNetwork',function ($rootScope, $window, $location, $log,AuthenticationService,PopupService,$cordovaNetwork) {

	 $rootScope.$on('$locationChangeStart',function locationChangeStart(event) {
        /*$log.log('locationChangeStart');*/
       
    if(!AuthenticationService.isAuthenticated) 
        {$location.path("/login");
    	  /*$log.log('未登录');*/
      }
       else {
    	   /*$log.log('已登录');*/
       }
        /*var isOnline = $cordovaNetwork.isOnline();
        if (isOnline){}
            else {PopupService.showAlert("网络错误,请检查手机网络设置或尝试重启")}; */
    })

   $rootScope.$on('$locationChangeSuccess', function locationChangeSuccess(event) {
        /*$log.log('locationChangeSuccess');*/
    })

   $rootScope.$on('$routeChangeStart', function routeChangeStart(event) {
        /*$log.log('routeChangeStart');*/
    })

    $rootScope.$on('$routeChangeSuccess',function routeChangeSuccess(event) {
        /*$log.log('routeChangeSuccess');*/
    })
}]);

app.config(function($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
 
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
 
            for (name in obj) {
                value = obj[name];
 
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                            + encodeURIComponent(value) + '&';
                }
            }
 
            return query.length ? query.substr(0, query.length - 1) : query;
        };
 
        return angular.isObject(data) && String(data) !== '[object File]'
                ? param(data)
                : data;
    }];
});


/*在主页增加按返回键提出退出应用，在其它页面正常返回上个页面，只要注册一个处理事件就可以了*/
app.run(['$ionicPlatform', '$ionicPopup','$rootScope','$location', function ($ionicPlatform, $ionicPopup, $rootScope, $location) {

    //主页面显示退出提示框
    $ionicPlatform.registerBackButtonAction(function (e) {

        e.preventDefault();

        function showConfirm() {
            var confirmPopup = $ionicPopup.confirm({
                title: '<strong>退出应用?</strong>',
                template: '你确定要退出应用吗?',
                okText: '退出',
                cancelText: '取消'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    $rootScope.truck_licS= null;
                    ionic.Platform.exitApp();
                } else {
                    // Don't close
                }
            });
        }

        // Is there a page to go back to?
        if ($location.path() == '/app/nTask'||$location.path() == '/login' ) {
            showConfirm();
        } else if ($rootScope.$viewHistory.backView ) {
            /*console.log('currentView:', $rootScope.$viewHistory.currentView);*/
            // Go back in history
           /* $rootScope.$viewHistory.backView.go();*/
            history.go(-1);
        } else {
            // This is the last page: Show confirmation popup
          /*  showConfirm();*/
            history.go(-1);
        }

        return false;
    }, 101);

}]);