
angular.module( "app.controllers", [] )
.controller('appCtrl', function($scope, $location,$window, UserService, AuthenticationService,PopupService) {
	 
})

.controller("nTaskCtrl", function($scope,options,$http,$location,GPSService,$ionicLoading,PopupService,$ionicModal,$timeout,$rootScope,dateService,$ionicPopup) {
$scope.confirmCancel=function(message) {
        var confirmPopup = $ionicPopup.confirm({
            title: '<strong>取消任务?</strong>',
            template: '<p style="text-align: center" >你确定要取消任务吗?</p>',
            okText: '确定',
            cancelText: '取消'
           });

        confirmPopup.then(function (res) {
            if (res) {
        $http.post(options.api.base_url+"/d/c"+"?o=json",{did:message})
       .success(function(data){
       PopupService.showAlert(data.sr.resultMessage);
       $scope.modal.hide();
       $scope.doReFresh();
        $location.path("/app/nTask")
        })
     .error(function(data,status,headers,config){
          PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码     
        }); 
            } else {
                // Don't close
            }
           });
        $timeout(function() {
          confirmPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);
         };
 $scope.confirmFinish=function(message) {
        var confirmPopup = $ionicPopup.confirm({
            title: '<strong>结束任务?</strong>',
            template: '<p style="text-align: center" >你确定要结束任务吗?</p>',
            okText: '确定',
            cancelText: '取消'
           });

        confirmPopup.then(function (res) {
            if (res) {
       /* var posOptions = {timeout: 10000, enableHighAccuracy: true};
        $ionicLoading.show({
              template: '定位中...'
          });
        $cordovaGeolocation.getCurrentPosition(posOptions)*/
         GPSService.getGPS()
            .then(
            function (position) {
                $ionicLoading.hide();
                var lat  = position.coords.latitude;
                var long = position.coords.longitude;
                $http.post(options.api.base_url+"/d/f"+"?o=json",{did:message,lat:lat,lng:long})
               .success(function(data){
               PopupService.showAlert(data.sr.resultMessage);
               $scope.modal.hide();
               $scope.doReFresh();
               $location.path("/app/nTask")
                 })
              .error(function(data,status,headers,config){
                PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码     
                  });                  }, 
           function(err) {
             $ionicLoading.hide();
            PopupService.showAlert( "定位失败,请检查网络连接或者定位是否开启");
        });
      /* $http.post(options.api.base_url+"/d/f"+"?o=json",{did:message,lat:0,lng:0})
       .success(function(data){
       PopupService.showAlert(data.sr.resultMessage);
       $scope.modal.hide();
       $scope.doReFresh();
       $location.path("/app/nTask")
        })
       .error(function(data,status,headers,config){
          PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码     
        }); */
            } else {
                // Don't close
            }
           });
        $timeout(function() {
          confirmPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);
         };        
	 $scope.cancelTask = function (dispatchId){
		    $scope.dispatchId=dispatchId;
        $scope.confirmCancel($scope.dispatchId);
	 };
	 $scope.finishTask = function (dispatchId){
		 $scope.dispatchId=dispatchId;
        $scope.confirmFinish($scope.dispatchId);
	 };
	 $ionicModal.fromTemplateUrl('views/nTaskDetail.html', {
	    	scope: $scope,
	        animation: 'slide-in-up'
	      }).then(function(modal) {
	        $scope.modal = modal;
	      });
	    $scope.TaskDetail=function(nTask) {
	        $rootScope.nTaskDetail=nTask;
	        $scope.modal.show();
	    };
	    $scope.closeTaskDetail = function() {
	        $scope.modal.hide();
	      }
     

        $scope.nTasks = [];
        $scope.page = 1;
        $scope.moreDataCanBeLoaded=true;
        $scope.loadMore = function() {
        $http.get(options.api.base_url+"/d/"+"?o=json"+"&page="+$scope.page)
            .success(function(data) {
           
            	var datarows=data.rows;
            	/*alert(datarows);*/
        if(datarows !=''){
        	if(data.page!=$scope.ppage){
            var count=datarows.length;
            for (var i = 0; i < count; i++) {
                var GPS  =
                {
               "firstGPS" : "",
               "secondGPS" : ""};
                GPS.firstGPS=dateService.transformGPS(datarows[i].firstTerminal);
                GPS.secondGPS=dateService.transformGPS(datarows[i].secondTerminal);
                /*console.log(GPS);*/
                datarows[i].GPS=GPS;
                datarows[i].firstTerminal=dateService.transformAddress(datarows[i].firstTerminal);
                datarows[i].secondTerminal=dateService.transformAddress(datarows[i].secondTerminal);
                /*console.log(datarows[i]);*/
                $scope.nTasks.push(datarows[i]);
                         }
            $scope.ppage= $scope.page;
            $scope.page+= 1 ;}
            $scope.$broadcast('scroll.infiniteScrollComplete');}
        else{       /*alert( "no more Data"); */
                $scope.moreDataCanBeLoaded=false;}
             } )
            .error(function(data,status,headers,config){
                PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码     
                $scope.moreDataCanBeLoaded=false;
            })
    };
    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });
    $scope.$on('$stateChangeStart', function() {
        $scope.modal.hide();
    });

$scope.doReFresh=function(){
              $scope.$broadcast('scroll.refreshComplete');
              $scope.nTasks = [];
              $scope.page = 1;
              $scope.ppage= 0;
              $scope.moreDataCanBeLoaded=true;
              $scope.loadMore();
               }

})
/*.controller("nTaskDetailCtrl",  function($scope){
 
})*/
.controller("aTaskCtrl",  function($scope,$cordovaLocalNotification,options,$interval,GPSService,$ionicLoading,$http,$location,PopupService,dateService,$ionicModal,$timeout,$rootScope,$ionicPopup){
	 
/*$scope.LocalNotification = function() {
   $cordovaLocalNotification.add({
             title: "新任务",
             message: "您当前有可接任务"
    }).then(function () {
    });
};*/
    /*接受任务*/
   $scope.confirmAccept=function(message) {
        var confirmPopup = $ionicPopup.confirm({
            title: '<strong>接受任务?</strong>',
            template: '<p style="text-align: center" >你确定要接受任务吗?</p><p style="color: lightskyblue;text-align: center" >当前需要定位并提交</p>',
            okText: '确定',
            cancelText: '取消'
           });

        confirmPopup.then(function (res) {
            if (res) {
              /*var posOptions = {timeout: 10000, enableHighAccuracy: true};
              $ionicLoading.show({
                    template: '定位中...'
                });
              $cordovaGeolocation.getCurrentPosition(posOptions)*/
              GPSService.getGPS()
                  .then(
                  function (position) {
                      $ionicLoading.hide();
                      var lat  = position.coords.latitude;
                      var long = position.coords.longitude;
                      $http.post(options.api.base_url+"/d/a"+"?o=json",{did:message,lat:lat,lng:long})
                     .success(function(data){
                     PopupService.showAlert(data.sr.resultMessage);
                     $scope.modal.hide();
                     $scope.doReFresh();
                     $location.path("/app/aTask")
                       })
                    .error(function(data,status,headers,config){
                      PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码     
                        });                  }, 
                 function(err) {
                   $ionicLoading.hide();
                  PopupService.showAlert( "定位失败,请检查网络连接或者定位是否开启");
              });
       /*$http.post(options.api.base_url+"/d/a"+"?o=json",{did:message,lat:0,lng:0})
       .success(function(data){
       PopupService.showAlert(data.sr.resultMessage);
       $scope.modal.hide();
       $scope.doReFresh();
       $location.path("/app/aTask")
        })
     .error(function(data,status,headers,config){
          PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码     
        }); */
            } else {
                // Don't close
            }
           });
        $timeout(function() {
          confirmPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);
         };

         /*拒绝任务*/
$scope.confirmReject=function(message) {
        var confirmPopup = $ionicPopup.confirm({
            title: '<strong>拒绝任务?</strong>',
            template: '<p style="text-align: center">你确定要拒绝任务吗?</p>',
            okText: '确定',
            cancelText: '取消'
           });

        confirmPopup.then(function (res) {
            if (res) {
        $http.post(options.api.base_url+"/d/re"+"?o=json",{did:message})
     .success(function(data){
       PopupService.showAlert(data.sr.resultMessage);
       $scope.modal.hide();
       $scope.doReFresh();
       $location.path("/app/aTask")
        })
     .error(function(data,status,headers,config){
          PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码     
        }); 
            } else {
                // Don't close
            }
           });
        $timeout(function() {
          confirmPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);
         };
         /*接受任务*/
   $scope.acceptTask = function (dispatchId){
		 $scope.dispatchId=dispatchId;
        $scope.confirmAccept($scope.dispatchId);
	 };

         /*拒绝任务*/
	 $scope.rejectTask = function (dispatchId){
		 $scope.dispatchId=dispatchId;
        $scope.confirmReject($scope.dispatchId);
	 };
   /*Modal弹出控制*/
	 $ionicModal.fromTemplateUrl('views/aTaskDetail.html', {
	    	scope: $scope,
	        animation: 'slide-in-up'
	      }).then(function(modal) {
	        $scope.modal = modal;
	      });
	    $scope.TaskDetail=function(aTask) {
	        $rootScope.aTaskDetail=aTask;
	        $scope.modal.show();
	 
	        /*$timeout(function() {
	            $scope.closeTaskDetail();
	          }, 5000);*/
	    };
	    $scope.closeTaskDetail = function() {
	        $scope.modal.hide();
	      }

/*当前任务页面加载*/
	      $scope.aTasks = [];
        $scope.page = 1;
        $scope.moreDataCanBeLoaded=true;
        $scope.loadMore = function() {
        $http.get(options.api.base_url+"/d/ava"+"?o=json"+"&page="+$scope.page)
            .success(function(data) {
           
            	var datarows=data.rows;
              $rootScope.aTaskTotal = data.total;
        if(datarows !=''){
        	if(data.page!=$scope.ppage){
            var count=datarows.length;
            for (var i = 0; i < count; i++) {
                var GPS  =
                {
               "firstGPS" : "",
               "secondGPS" : ""};
                GPS.firstGPS=dateService.transformGPS(datarows[i].firstTerminal);
                GPS.secondGPS=dateService.transformGPS(datarows[i].secondTerminal);
                /*console.log(a);*/
                datarows[i].GPS=GPS;
                datarows[i].firstTerminal=dateService.transformAddress(datarows[i].firstTerminal);
                datarows[i].secondTerminal=dateService.transformAddress(datarows[i].secondTerminal);
                /*console.log(datarows[i]);*/
                $scope.aTasks.push(datarows[i]);
                         }
            $scope.ppage= $scope.page;
            $scope.page+= 1 ;}
            $scope.$broadcast('scroll.infiniteScrollComplete');}
        else{       /*alert( "no more Data"); */
                $scope.moreDataCanBeLoaded=false;}
             } )
            .error(function(data,status,headers,config){
                PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码     
                $scope.moreDataCanBeLoaded=false;
            })
    };
    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
         if ($rootScope.isChecked) {
           $rootScope.isChecked=true;
               $scope.aTasks = [];
               $scope.page = 1;
               $scope.ppage= 0;
               $scope.moreDataCanBeLoaded=true;
               $scope.loadMore();
               autoTimer=$interval(function(){
                         $scope.aTasks = [];
                         $scope.page = 1;
                         $scope.ppage= 0;
                         $scope.moreDataCanBeLoaded=true;
                         $scope.loadMore();
                    },30000);
        }
        else{$rootScope.isChecked=false};
    });
    $scope.$on('$stateChangeStart', function() {
        $scope.modal.hide();
    });
     $scope.$on("$destroy", function() {
        /*if (autoTimer) {
            $interval.cancel(autoTimer);
        }*/
    });
$scope.doReFresh=function(){
              $scope.aTasks = [];
              $scope.page = 1;
              $scope.ppage= 0;
              $scope.moreDataCanBeLoaded=true;
              $scope.loadMore();
              $scope.$broadcast('scroll.refreshComplete');
               }; 
$scope.autoReFresh=function(){
  if(!$rootScope.isChecked){
    $rootScope.isChecked=true;
    $scope.aTasks = [];
    $scope.page = 1;
    $scope.ppage= 0;
    $scope.moreDataCanBeLoaded=true;
    $scope.loadMore();
    autoTimer=$interval(function(){
              $scope.aTasks = [];
              $scope.page = 1;
              $scope.ppage= 0;
              $scope.moreDataCanBeLoaded=true;
              $scope.loadMore();

              $cordovaLocalNotification.add({
                        title: "新任务",
                        message: "您当前有"+$rootScope.aTaskTotal+"项可接任务"
               }).then(function () {
               });

         },3000);
             }
    else{$interval.cancel(autoTimer);
      $rootScope.isChecked=false;
               }
             }
     
})

.controller("hTaskCtrl",  function($scope,options,$http,PopupService,$ionicModal,$timeout,$rootScope,dateService) {
  	 /*获取历史任务*/
    $ionicModal.fromTemplateUrl('views/hTaskDetail.html', {
    	scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
    $scope.TaskDetail=function(hTask) {
        $rootScope.hTaskDetail=hTask;
        $scope.modal.show();
 
       /* $timeout(function() {
            $scope.closeTaskDetail();
          }, 5000);*/
    };
    $scope.closeTaskDetail = function() {
        $scope.modal.hide();
      };


        $scope.hTasks = [];
        $scope.page = 1;
        $scope.moreDataCanBeLoaded=true;
        $scope.loadMore = function() {
        $http.get(options.api.base_url+"/d/h"+"?o=json"+"&page="+$scope.page)
            .success(function(data) {
           
            	var datarows=data.rows;
            	/*alert(datarows);*/
        if(datarows !=''){
        	if(data.page!=$scope.ppage){
            var count=datarows.length;
            for (var i = 0; i < count; i++) {
                /*var   e=new   Date(datarows[i].endTime); 
                datarows[i].endTime=dateService.formatDate(e);
                var   b=new   Date(datarows[i].beginTime); 
                datarows[i].beginTime=dateService.formatDate(b);*/
                datarows[i].firstTerminal=dateService.transformAddress(datarows[i].firstTerminal);
                datarows[i].secondTerminal=dateService.transformAddress(datarows[i].secondTerminal);
                $scope.hTasks.push(datarows[i]);
                         }
            $scope.ppage= $scope.page;
            $scope.page+= 1 ;}
            $scope.$broadcast('scroll.infiniteScrollComplete');}
        else{       /*alert( "no more Data"); */
                $scope.moreDataCanBeLoaded=false;}
             } )
            .error(function(data,status,headers,config){
                PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码     
                $scope.moreDataCanBeLoaded=false;
            })
    };
    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });
    $scope.$on('$stateChangeStart', function() {
        $scope.modal.hide();
    });



})
/*.controller("hTaskDetailCtrl", function( $scope){
  
})*/
.controller("moreCtrl",function($scope,options, $location,$window,$interval,UserService,$rootScope,AuthenticationService,intervalService,PopupService){
	   $scope.BaseURL=options.api.base_url;
     $scope.logOut = function logOut() {
            if (AuthenticationService.isAuthenticated) {

                UserService.logOut().success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    delete $window.sessionStorage.JSESSIONID;
                    delete $window.localStorage.username;
                    delete $window.localStorage.password;
                    $rootScope.truck_licS= null;
                    $interval.cancel(timer);
                    $rootScope.checkedChange=false;
                    $interval.cancel(autoTimer);
                    $rootScope.isChecked=false;
                    $location.path("/login");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("/login");
            }
        };
     $scope.intervalChange = function ()  {
      if($rootScope.checkedChange){$interval.cancel(timer);
        $rootScope.checkedChange=false;
      }
         else{intervalService.intervalHttp();
            $rootScope.checkedChange=true; 
         }
       };
    $scope.modifyBaseURL = function(BaseURL){
      options.api.base_url= BaseURL;
      $scope.BaseURL = options.api.base_url;
      AuthenticationService.isAuthenticated = false;
      delete $window.sessionStorage.JSESSIONID;
      delete $window.localStorage.username;
      delete $window.localStorage.password;
      $rootScope.truck_licS= null;
      $interval.cancel(timer);
      $location.path("/login");    }
})
.controller("locationCtrl",function( $scope,options,$stateParams,$cordovaGeolocation,$ionicActionSheet, $timeout,PopupService){
   $scope.GPS= JSON.parse($stateParams.GPS);
   var map = new qq.maps.Map(document.getElementById("allmap"),{
        center:  new qq.maps.LatLng(29.8698,121.55329),
        zoom: 10
    });


  $scope.getCurrentPosition=function(){
     var posOptions = {timeout: 10000, enableHighAccuracy: true};
	   $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {  		    	     
  	      $scope.lat  = position.coords.latitude;
  	      $scope.long = position.coords.longitude ;
        var nowGPS=new qq.maps.LatLng($scope.lat ,$scope.long);
        qq.maps.convertor.translate(nowGPS, 1, function(res){
        $scope.latlng = res[0];
        map.panTo($scope.latlng);
        var marker = new qq.maps.Marker({
            map : map,
            position : $scope.latlng
            });
        var infoWin = new qq.maps.InfoWindow({
        map: map
              });
        infoWin.open();
        infoWin.setContent('<p">这是您的当前位置</p>');
        infoWin.setPosition($scope.latlng);
        setTimeout(function(){
        infoWin.close();
          },3000);
         });
  	    }, function(err) {
  	      PopupService.showAlert("定位失败，请检查网络连接或者定位是否开启");// error	 
  	     /* $scope.lat  = 39.911082;
          $scope.long = 108.396135;

          var nowGPS=new qq.maps.LatLng($scope.lat ,$scope.long);
        qq.maps.convertor.translate(nowGPS, 1, function(res){
        $scope.latlng = res[0];
        map.panTo($scope.latlng);
        var marker = new qq.maps.Marker({
            map : map,
            position : $scope.latlng
            });
        var infoWin = new qq.maps.InfoWindow({
        map: map
              });
        infoWin.open();
        infoWin.setContent('<div style="height:30px;">这是您的当前位置</div>');
        infoWin.setPosition($scope.latlng);
        setTimeout(function(){
        infoWin.close();
          },3000);
         });*/
     });
  };
	

    $scope.drivingService = new qq.maps.DrivingService({
      map : map
    });

    $scope.getRoute=function(){
      var  firstGPS=$scope.GPS.firstGPS;
      var  secondGPS=$scope.GPS.secondGPS;
      var a =$scope.GPS.firstGPS;
    var start = new qq.maps.LatLng(firstGPS.lat,firstGPS.long);
    var end = new qq.maps.LatLng(secondGPS.lat,secondGPS.long);
    qq.maps.convertor.translate(start, 1, function(res){
        $scope.start = res[0];
        qq.maps.convertor.translate(end, 1, function(res){
        $scope.end = res[0];
        $scope.drivingService.search(start, end);
         });
         });
    
   };
    
 //qq地图API功能
  $scope.init=function(){
        var  firstGPS=$scope.GPS.firstGPS;
        var  secondGPS=$scope.GPS.secondGPS;
        var a =$scope.GPS.firstGPS;
      var start = new qq.maps.LatLng(firstGPS.lat,firstGPS.long);
      var end = new qq.maps.LatLng(secondGPS.lat,secondGPS.long);
      qq.maps.convertor.translate(start, 1, function(res){
          $scope.start = res[0];
          qq.maps.convertor.translate(end, 1, function(res){
          $scope.end = res[0];
          $scope.drivingService.search(start, end);
          setTimeout(function() {
              $scope.getCurrentPosition();
          }, 2000);
           });
           });
      
     };
   $scope.init();
   /*setTimeout(function() {
        $scope.getCurrentPosition();
    }, 2000);*/
 
   
	
	$scope.show = function() {

		   // Show the action sheet
		   var hideSheet = $ionicActionSheet.show({
		     
		       buttons: [
		                 { text: '<b>当前位置</b>',
		       		      /* buttonClicked: function() {
		   		    	  
		 	  				var marker = new BMap.Marker($scope.defaultpoint);
		 	  				bm.addOverlay(marker);
		 	  				var label = new BMap.Label("我的位置",{offset:new BMap.Size(20,-10)});
		 	  				marker.setLabel(label); 
		 	  				bm.setCenter($scope.defaultpoint);
		 			                            }*/
		                	 }/*,
		                 { text: 'Move' }*/
		               ],
		   
		     destructiveText: '<b>路线显示</b><i class="icon ion-arrow-move"></i>',
		     destructiveButtonClicked: function() {
		     $scope.getRoute();
		    	 hideSheet();
			    	
             },
		     titleText: '地图服务',
		     cancelText: '取消',
		     cancel: function() {
		    	 hideSheet();
		        },
		     buttonClicked: function() {
		    	    $scope.getCurrentPosition();
  					hideSheet();
		          },
		   });

		   // For example's sake, hide the sheet after two seconds
		   $timeout(function() {
		     hideSheet();
		   }, 4000);

		 };	 
	 
})

.controller("selectTruckCtrl",function($scope,options,$rootScope,$http,PopupService,$ionicPopup, $timeout, $location,intervalService){
	  $http.get(options.api.base_url+"/st"+"?o=json")
      .success(function(data){
    	  $scope.trucks=data.rows;
        if($rootScope.truck_licS){$scope.selected=true;}
          else {$scope.selected=false;}
      })
      .error(function(data,status,headers,config){
      	PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码
       
      });
      $scope.setTruck = function (truckLic){
        $scope.truckLic=truckLic;
        $scope.confirmTruck($scope.truckLic);
      };
      $scope.confirmTruck=function(message) {
        var confirmPopup = $ionicPopup.confirm({
            title: '<strong>绑定车辆?</strong>',
            template: '<p style="text-align: center" >你确定要绑定车辆吗?</p>',
            okText: '确定',
            cancelText: '取消'
           });

        confirmPopup.then(function (res) {
            if (res) {
       $http.post(options.api.base_url + '/st'+"?o=json", {truck_lic: $scope.truckLic} )
       .success(function(data){
        $rootScope.truck_licS=$scope.truckLic;
        if($scope.selected){PopupService.showAlert(data.sr.resultMessage);
                            $location.path("/app/nTask")}
            else{intervalService.intervalHttp();
                 $http.get(options.api.base_url+"/d/ava"+"?o=json"+"&page=1").success(function(data){
                              if(data.total !== 0){PopupService.showAlert("当前有"+data.total+"件可接任务");
                                                                            $location.path("/app/aTask")}
                                else{PopupService.showAlert('已设置运行车辆为'+$scope.truckLic);
                                                                 $location.path("/app/nTask")}
                                 })
                } 
      })
      .error(function(data,status,headers,config){
        PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码
       
      });
            } else {
                // Don't close
            }
           });
        $timeout(function() {
          confirmPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);
         }
        })
.controller("userInfoCtrl",function($scope,options,PopupService, UserService){
    UserService.userInfo()
      .success(function(data){
        $scope.userInfo=data;
      })
      .error(function(data,status,headers,config){
        PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码
       
      });
        })
 /*用户管理 */  
    .controller('AdminUserCtrl', function($rootScope,options,$http,$scope, $location, $window, UserService, intervalService,AuthenticationService,$ionicLoading,PopupService) {

        $scope.signIn = function signIn(username, password) {
        	
           if (username != null && password != null) {
            	$ionicLoading.show({
                    template: '登录中...'
                });
                UserService.signIn(username, password).success(function(data) {
                	/*alert(data.success+data.message+name);*/
                	if(data.sr.resultCode == 0){
                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage.JSESSIONID = data.sid;
                    $window.localStorage.username = username;
                    $window.localStorage.password = password;
                    $rootScope.full_nameS=data.full_name;
                    var lic = data.truck_lic;  
                    if (lic == null ){
                      if($rootScope.truck_licS == null){$location.path("/selectTruck")}
                      else{$http.post(options.api.base_url + '/st'+"?o=json", {truck_lic: $rootScope.truck_licS});
                           intervalService.intervalHttp();
                           $location.path("/app/nTask")}
                     }
                      else {
                        if($rootScope.truck_licS == null){$location.path("/selectTruck")}
                          else{$rootScope.truck_licS=data.truck_lic;
                              $location.path("/app/nTask")};
                        };
                    $ionicLoading.hide();}
                    else{$ionicLoading.hide();
                    PopupService.showAlert(data.sr.resultMessage);
                    }
                }).error(function(status, data) {
                	 $ionicLoading.hide();
                	 PopupService.showAlert("无法连接服务,请检查网络连接");   
                });
            }
        }

        $scope.logOut = function logOut() {
            if (AuthenticationService.isAuthenticated) {

                UserService.logOut().success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    delete $window.sessionStorage.JSESSIONID;
                    delete $window.localStorage.username;
                    delete $window.localStorage.password;
                    $rootScope.truck_licS= null;
                    $interval.cancel(timer);
                    $location.path("/");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("/login");
            }
        }
        //自动登陆
if(window.localStorage.username != null){  
  var username=$window.localStorage.username;
  var password=$window.localStorage.password;
     $scope.signIn(username,password);
 }
else{} ;

       /* $scope.register = function register(username, password, passwordConfirm) {
            if (AuthenticationService.isAuthenticated) {
                $location.path("/admin");
            }
            else {
                UserService.register(username, password, passwordConfirm).success(function(data) {
                    $location.path("/admin/login");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }*/
    }
)



.controller("registerCtrl", function( $scope){
     
})

.controller("changePasswordCtrl",function($scope,options,$http,PopupService,UserService){
    
    $scope.changePassword = function changePassword(oldPassword, newPassword,retypenewPassword) {
      if (oldPassword != null && newPassword != null && retypenewPassword != null) 
      {
      if (newPassword == retypenewPassword) {
        UserService.changePassword(oldPassword, newPassword,retypenewPassword)
          .success(function(data){
            PopupService.showAlert(data.sr.resultMessage);
          })
          .error(function(data,status,headers,config){
            PopupService.showAlert( "无法连接服务,请检查手机网络设置或尝试重启"); //一些错误处理代码
           
          });
      }
        else{PopupService.showAlert("两次密码输入不一致，请重新输入");   }
      }
  }
})