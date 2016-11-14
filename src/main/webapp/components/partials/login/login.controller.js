angular
    .module('MainApp')
    .controller('LoginCtrl', function($scope, $rootScope,$state, gettextCatalog , Auth,SessionStorageService, UserSvc) {

        $scope.user = {isAuthenticated : SessionStorageService.get('token')};

        $scope.login = function() {
            Auth.login($scope.user,
                function(data) {
                    $rootScope.error = "";
                    SessionStorageService.put('token',data.token);
                    $rootScope.$broadcast("loginlogout", data.user);
                    
                    Auth.isAlive().success(function(user){
                        $scope.user=user;
                        
                        if(user.isSuperAdmin)
                             $state.go('admin');
                        else{
                            $state.go('product.home');
                        }
                    });
                },
                
                function(err,code) {
                    $rootScope.error =  gettextCatalog.getString('Invalid credentials.');
                });
        };

        $scope.required = {email : false};
        $scope.reset = {};


        $rootScope.$on("loginlogout", function () {

            $scope.user = undefined;
            $rootScope.currentUser = undefined;
            $rootScope.company = undefined;
            $rootScope.product = undefined;
            $rootScope.notiVisible = false;
            
        });



    }
);