angular
    .module('MainApp')
    .controller('UserCtrl', function($scope,$modal,$filter,UserSvc,RoleSvc,CompanySvc) {
     $scope.tabs = {users:true};
     $scope.pagination = {itemsPerPage:8,currentPage : 1};
     $scope.filter = {};
     $scope.roles = {};
     
    function populateUsers(){
        UserSvc.paginate($scope.pagination.currentPage,$scope.pagination.itemsPerPage,$scope.filter)
                            .success(function(response){
                                $scope.pagination.totalItems=response.count;
                                $scope.users=response.data;
        });
    }

    populateUsers();
    
    $scope.$watch('pagination.currentPage', function(newPage, oldPage) {
        if(newPage !== oldPage){
            populateUsers();
        }
    });

    $scope.$watch('filter',function(pattern){
        if(_.isEmpty()){
            populateUsers();
        }
    },true);

  	$scope.addUser = function(){
    		var modalInstance = $modal.open({
                templateUrl  : 'components/backoffice/user/views/user-add.html',
                size : 'lg',
                controller   : function($scope,$modalInstance,RoleSvc,$location) {
                    $scope.required = {};
                    $scope.duplicate ={};
                    $scope.valide = {email:true};
                    $scope.save = function() {
                        $scope.required.email = !$scope.user || !$scope.user.email ||!$scope.user.email.trim().length;
                        $scope.required.firstName = !$scope.user || !$scope.user.firstName ||!$scope.user.firstName.trim().length;
                        $scope.required.lastName = !$scope.user || !$scope.user.lastName ||!$scope.user.lastName.trim().length;
                        $scope.required.password = !$scope.user || !$scope.user.password ||!$scope.user.password.trim().length;
                        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        $scope.valide.email = re.test($scope.user.email);
                         
                        if ($scope.valide.email && !$scope.required.email &&  !$scope.required.firstName && !$scope.required.lastName && !$scope.required.password) {
                            if($scope.user.type == 'SuperAdmin' )
                                $scope.user.isSuperAdmin = true;
                            UserSvc.create($scope.user).success(function () {
                                $modalInstance.dismiss('cancel');
                                populateUsers();
                                
                            })
                            .error(function(err,code) {
                                
                                    if(code==403)
                                    {
                                        $modalInstance.dismiss('cancel');
                                       $location.path("/"); 
                                    }
                                    else
                                    $scope.duplicate.email=true;
                            });
                    	}
                    };
                    function getRoles(){
                         RoleSvc.findAll().success(function(response){
                            $scope.roles=response;
                        });
                    }
                    function getCompanies(){
                         CompanySvc.findAll().success(function(response){
                            $scope.companies=response;
                        });
                    }
                    getRoles();
                    getCompanies();
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });
    }

    $scope.editUser = function(id) {
            var modalInstance = $modal.open({
                templateUrl  : 'components/backoffice/user/views/user-edit.html',
                size : 'lg',
                controller   : function($scope,$modalInstance,$location) {
                    $scope.required = {};
                    $scope.duplicate = {};
                    $scope.valide = {email:true};
                    $scope.copieCompanies = {};

                    UserSvc.findOne(id).success(function(user){
                        $scope.user = user;
                    })

                    $scope.filter = function(){
                        $scope.companies = angular.copy($scope.copieCompanies);
                        $scope.companies = _.reject($scope.copieCompanies,function(company){
                            if(_.find($scope.user.companies,function(companyUser){  return companyUser._id == company._id}))
                                return true;
                        })
                    }

                    $scope.save = function() {
                        $scope.required.email = !$scope.user || !$scope.user.email ||!$scope.user.email.trim().length;
                        $scope.required.firstName = !$scope.user || !$scope.user.firstName ||!$scope.user.firstName.trim().length;
                        $scope.required.lastName = !$scope.user || !$scope.user.lastName ||!$scope.user.lastName.trim().length;           
                        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        $scope.valide.email = re.test($scope.user.email);
                         
                        if ($scope.valide.email && !$scope.required.email &&  !$scope.required.firstName && !$scope.required.lastName && !$scope.required.password) {
                         if($scope.user.type == 'SuperAdmin' )
                                $scope.user.isSuperAdmin = true;
                            UserSvc.edit($scope.user).success(function () {
                                $modalInstance.dismiss('cancel');
                                populateUsers();
                            })
                           .error(function(err,code) {
                                    if(code==403)
                                    {
                                        $modalInstance.dismiss('cancel');
                                       $location.path("/"); 
                                    }
                                    else
                                    $scope.duplicate.email=true;
                            });
                        }
                    };

                    function getRoles(){
                         RoleSvc.findAll().success(function(response){
                            $scope.roles=response;
                        });
                    }

                    function getCompanies(){
                         CompanySvc.findAll().success(function(response){
                            $scope.companies = response;
                            $scope.copieCompanies = angular.copy($scope.companies);
                            $scope.filter();

                        });
                    }

                    getRoles();
                    getCompanies();

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });
    };

    $scope.deleteUser = function(id) {
            var modalInstance = $modal.open({
                templateUrl  : 'components/backoffice/user/views/user-delete.html',
                controller   : function($scope,$modalInstance,$location) {

                    UserSvc.findOne(id).success(function(user){
                        $scope.user = user;
                    })

                    $scope.save = function() {
                        UserSvc.delete(id).success(function(){
                            $modalInstance.dismiss('cancel');
                            populateUsers();
                        })
                        .error(function(err,code) {
                                    if(code==403)
                                    {
                                        $modalInstance.dismiss('cancel');
                                       $location.path("/"); 
                                    }
                                    else
                                    $scope.duplicate.email=true;
                            });
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });
    };      
    
    $scope.showRole = function(role) {
            var modalInstance = $modal.open({
                templateUrl  : 'components/backoffice/role/views/role-show.html',
                size : 'lg',
                controller   : function($scope,$modalInstance) {
                    $scope.entities = CONSTANTS.entities;
                    $scope.rights = CONSTANTS.rights;
                   $scope.role=role;
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };



                    $scope.getRight = function (code,entity){
            
                            var label="";
                            switch(code){
                                case 'GET' :
                                    label =' View ';
                                    break;
                                case 'PUT' :
                                    label =' Edit ';
                                    break;
                                case 'POST' :
                                    label =' Create ';
                                    break;
                                case 'DELETE' :
                                    label =' Delete ';
                                    break;
                            }
                            
                            label+=entity.toLowerCase();
                            return label;
                        }


                }
            });
    };

    $scope.showCompany = function(company) {
            var modalInstance = $modal.open({
                templateUrl  : 'components/backoffice/company/views/company-show.html',
                size : 'lg',
                controller   : function($scope,$modalInstance) {
                    $scope.company=company;
                     
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });
    };

 })