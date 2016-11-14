angular.module('MainApp')
    .factory('Auth', function($http,$rootScope,SessionStorageService){
        var service = {
            isAlive : function(){
                return $http.get('/isAlive');
            
            },
            login: function(user, success, error) {
                
                $http.post('/login', user)
                    .success(function(user){
                       
                        success(user);
                    })
                    .error(error);
                   
            },
            logout: function(success, error) {
                $rootScope.messages = [];
                $rootScope.currentUser = {};
                $rootScope.notification = "";
                $http.post('/logout')
                    .success(function(){success();})
                    .error(error);
            }
        };

        return service;
    })
    .factory('TokenInterceptor', function ($q, $window, SessionStorageService, $location, $rootScope) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (SessionStorageService.get('token')) {
                    config.headers.Authorization = 'Bearer ' + SessionStorageService.get('token');
                    config.headers.Country = SessionStorageService.get('country');
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection != null && rejection.status === 401) {
                    SessionStorageService.delete('token');
                    $rootScope.$broadcast("loginlogout", {});
                    $location.path('/');
                }
                return $q.reject(rejection);
            }

        };
    });