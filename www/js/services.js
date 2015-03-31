angular.module( "app.services", [] )
.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
        isAdmin: false
    }

    return auth;
})
.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            /*config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.NbrcToken =  $window.sessionStorage.token;
            }*/
            return config || $q.when(config);
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

/* Set Authentication.isAuthenticated to true if 200 received */

        response: function (response) {
           /* if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }*/

             if (response != null && response.status == 200 && response.data.sr && !AuthenticationService.isAuthenticated) {
                if(response.data.sr.resultCode == -10)
                    {
                            $location.path("/login");
                    }
            }
            return response || $q.when(response);
        },

/* Revoke client authentication if 401 is received */

        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
            /*    delete $window.sessionStorage.token;*/
                AuthenticationService.isAuthenticated = false;
                $location.path("/login");
            }

            return $q.reject(rejection);
        }
    };
})
.factory('UserService', function ($http,options) {
    return {
        signIn: function(username, password) {
        	return $http.post(options.api.base_url + '/login'+"?o=json", {userName: username, password: password} );
        },

        logOut: function() {
            return $http.get(options.api.base_url + '/logOut'+"?o=json");
        },

        register: function(username, password, passwordConfirmation) {
            return $http.post(options.api.base_url + '/user/register', {username: username, password: password, passwordConfirmation: passwordConfirmation });
        },
        userInfo: function() {
            return $http.get(options.api.base_url+"/userInfo"+"?o=json");
        },
        changePassword: function(oldPassword, newPassword,retypenewPassword) {
            return $http.post(options.api.base_url+"/changePassword"+"?o=json", {oldPassword: oldPassword, newPassword: newPassword,retypenewPassword:retypenewPassword} );
        },
        
    }
})

/*消息显示服务*/
.factory('PopupService', function ($ionicPopup, $timeout) {
    return {
        showAlert: function(message) {
     	   var alertPopup = $ionicPopup.alert({
     	     title: '<strong>消息提示</strong>',
     	     template:'<p style="text-align:center">'+message+'</p>',
     	     okText: '确定',
     	     okType:'button-calm'
     	   });
     	   alertPopup.then(function(res) {
     	     alertPopup.close();
     	   });
     	  $timeout(function() {
     		 alertPopup.close(); //close the popup after 3 seconds for some reason
     	  }, 3000);
     	 },
     	showConfirm:  function(message) {
     		var confirmPopup = $ionicPopup.confirm({
            title: '<strong>退出应用?</strong>',
            template: '<p style="text-align:center">'+message+'</p>',
            okText: '确定',
            cancelText: '取消'
           });

        confirmPopup.then(function (res) {
            if (res) {
//                ionic.Platform.exitApp();
            } else {
                // Don't close
            }
           });
        $timeout(function() {
        	confirmPopup.close(); //close the popup after 3 seconds for some reason
    	  }, 3000);
         }
    }
})

.factory('dateService', function () {
    return {
        formatDate:function (tm){ 
             /*return new Date(parseInt(tm)).toLocaleString().replace(/:\d{1,2}$/,' ');   */
             var   year=tm.getYear()+1900;   
             var   month=tm.getMonth()+1;   
             var   date=tm.getDate();   
             var   hour=tm.getHours();   
             var   minute=tm.getMinutes();   
             var   second=tm.getSeconds();   
             return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;   
            } ,
        transformAddress:function (ad){ 
            switch(ad)
            {
             case "BLCT":
             return "二期";
             break;
             case "BLCT2":
             return "三期";
             break;
             case "BLCT3":
             return "四期";
             break;
             case "BLCTYD":
             return "远东";
             break;
             case "DXCTE":
             return "大榭招商";
             break;
             case "BLCTMS":
             return "梅山";
             break;
             case "ZHCT":
             return "镇海";
             break;
             case "B2SCT":
             return "通达码头";
             break;
             case "BLCTZS":
             return "招商";
             break;
            }
        },
        transformGPS:function (ad){ 
            switch(ad)
            {
             case "BLCT":
              /*v*//*ar a = new qq.maps.LatLng(29.927972,121.861758)*/
              var a  =
                {
         "lat" : 29.927972,
         "long" : 121.861758
                   };
             return a;
             break;
             case "BLCT2":
            /* var a =new qq.maps.LatLng(29.930914,121.843266)*/
             var a  =
                {
         "lat" : 29.930914,
         "long" : 121.843266
                   };
             return a;
             break;
             case "BLCT3":
             /*var a =new qq.maps.LatLng(29.883036,122.024395)*/
             var a  =
                {
         "lat" : 29.883036,
         "long" : 122.024395
                   };
             return a;
             break;
             case "BLCTYD":
            /* var a =new qq.maps.LatLng(29.883036,122.024395)*/
             var a  =
                {
         "lat" : 29.883036,
         "long" : 122.024395
                   };
             return a;
             break;
             case "DXCTE":
             /*var a =new qq.maps.LatLng(29.935342,121.954744)*/
             var a  =
                {
         "lat" : 29.935342,
         "long" : 121.954744
                   };
             return a;
             break;
             case "BLCTMS":
             /*var a =new qq.maps.LatLng(29.768698,121.989562)*/
             var a  =
                {
         "lat" : 29.768698,
         "long" : 121.989562
                   };
             return a;
             break;
             case "ZHCT":
             /*var a =new qq.maps.LatLng(29.965684,121.723839)*/
             var a  =
                {
         "lat" : 29.965684,
         "long" : 121.723839
                   };
             return a;
             break;
             case "B2SCT":
             /*var a =new qq.maps.LatLng(29.925578,121.870306)*/
             var a  =
                {
         "lat" : 29.925578,
         "long" : 121.870306
                   };
             return a;
             break;
             case "BLCTZS":
             /*var a =new qq.maps.LatLng(29.923456,121.931106)*/
             var a  =
                {
         "lat" : 29.923456,
         "long" : 121.931106
                   };
             return a;
             break;
            }
        }
    }
})

.factory('intervalService', function ($cordovaGeolocation,options,$interval,$http,$rootScope,$ionicPopup,$timeout) {
    return {
        intervalHttp:function(){
            $rootScope.checkedChange=true;
            /*var c=1;*/
            timer=$interval(function(){
       /*console.log(c);c++;*/
   var posOptions = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
     function fixZero(num,length){
             var str=""+num;
             var len=str.length;
             var s="";
             for(var i=length;i-->len;){
             s+="0";
             }return s+str;
            }; 
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;
      var timestamp = position.timestamp ;
      var date=new Date(timestamp);
      var uptime=date.getFullYear()+fixZero(date.getMonth()+1,2)+fixZero(date.getDate(),2)+fixZero(date.getHours(),2)+fixZero(date.getMinutes(),2)+fixZero(date.getSeconds(),2);
            /*console.log("uptime:"+uptime+"lat:"+lat+"lng:"+long);*/
      $http.post(options.api.base_url+"/gps/update"+"?o=json",{lat:lat,lng:long,uptime:uptime})
         .success(function(data){
            /*console.log("success:gps 60s "+c+"次");*/
        })
         .error(function(data,status,headers,config){
            /* var alertPopup = $ionicPopup.alert({
             title: '<strong>消息提示</strong>',
             template:'<p style="text-align:center">GPS汇报时无法连接服务,请检查手机网络设置或尝试重启</p>',
             okText: '确定',
             okType:'button-calm'
           });
           alertPopup.then(function(res) {
             alertPopup.close();
           });
          $timeout(function() {
             alertPopup.close(); //close the popup after 3 seconds for some reason
          }, 3000);*/
         /*alert("GPS汇报时无法连接服务,请检查手机网络设置或尝试重启");*///一些错误处理代码     
        }); 
    }, function(err) {
      /* var alertPopup = $ionicPopup.alert({
             title: '<strong>消息提示</strong>',
             template:'<p style="text-align:center">GPS汇报时定位失败，请检查网络连接或者定位是否开启</p>',
             okText: '确定',
             okType:'button-calm'
           });
           alertPopup.then(function(res) {
             alertPopup.close();
           });
          $timeout(function() {
             alertPopup.close(); //close the popup after 3 seconds for some reason
          }, 3000);*/
    });
   },60000);
        }
    }

})

/*.factory('GPSService', function ($cordovaGeolocation,$http,$q,$ionicPopup,$timeout) {
  function getGPS(){
    var deferred = $q.defer();
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(
        function (position) {
          deferred.reslove(position);
       }, 
       function(err) {
        //PopupService.showAlert("定位失败，请检查网络连接或者定位是否开启")；
        var alertPopup = $ionicPopup.alert({
             title: '<strong>消息提示</strong>',
             template:'<p style="text-align:center">定位失败，请检查网络连接或者定位是否开启</p>',
             okText: '确定',
             okType:'button-calm'
           });
           alertPopup.then(function(res) {
             alertPopup.close();
           });
          $timeout(function() {
             alertPopup.close(); //close the popup after 3 seconds for some reason
          }, 3000);
        deferred.reject();
    });
       return deferred.promise;
 }

  return{
    getGPS:getGPS
  }
})*/
.factory('GPSService', function ($cordovaGeolocation,$ionicLoading) {
    return {
        getGPS: function() {
            var posOptions = {timeout: 10000, enableHighAccuracy: true};
              $ionicLoading.show({
                    template: '定位中...'
                });
            return $cordovaGeolocation.getCurrentPosition(posOptions);
        }
        
    }
})
