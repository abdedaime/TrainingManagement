angular
    .module('MainApp')
    .controller('NavCtrl', function($scope,$rootScope,$state, $modal, $window, Auth , gettextCatalog ,RoleSvc,CompanySvc, SessionStorageService, UserSvc,NotificationSvc,UserSvc) {
        $rootScope.notification = 0;
        $rootScope.messages = [];
        $rootScope.socket;
        $rootScope.notis = [];
        $scope.afterclicked = {};
        $rootScope.notiVisible = false;
        var mainMenus = [
            {
                icon : 'fa fa-sliders',
                title:  gettextCatalog.getString('Administration'),
                state: 'admin',
                right : 'GET_ADMIN'
            },
            {
                icon : 'fa fa-home',
                title:  gettextCatalog.getString('Home'),
                state: 'product.home',
                right : 'GET_PRODUCT'
            },
            {
                icon : 'fa fa-list',
                title:  gettextCatalog.getString('Products'),
                state: 'product.products',
                right : 'GET_PRODUCT'
            },
             {
                icon : 'fa fa-bug',
                title:  gettextCatalog.getString('Defects'),
                state: 'product.defects',
                right : 'GET_PRODUCT'
            },
            {
                icon : 'fa fa-line-chart',
                title:  gettextCatalog.getString('Analyse'),
                state: 'product.analyse',
                right : 'GET_PRODUCT'
            },
            {
                icon : 'fa fa-history',
                title:  gettextCatalog.getString('History'),
                state: 'history',
                right : 'GET_PRODUCT'
            }/*,
            {
                icon : 'fa fa-user',
                title:  gettextCatalog.getString('Tasks'),
                state: 'product.tasks',
                right : 'GET_PRODUCT'
            }*/
        ];

        getUserInfos(buildMenus);

        function buildMenus() {
            
         if(SessionStorageService.get('token')){
             $scope.mainMenus = mainMenus;

            } else {
                $scope.mainMenus = [];
            }

        };

        $scope.showMenu = function(menu){
            if(menu == 'Analyse' || menu === 'History')
                if(!$rootScope.currentUser.isSuperAdmin){
                    if($rootScope.currentUser.type != 'Full access')
                        return false;
                    return true;
                }
                else
                   return true
            else      
            return true
        }
        $scope.editUser = function(id) {
            var modalInstance = $modal.open({
                templateUrl  : 'components/backoffice/user/views/user-edit.html',
                size : 'lg',
                controller   : function($scope,$modalInstance,$location) {
                    $scope.required = {};
                    $scope.duplicate = {};
                    $scope.valide = {email:true};
                    $scope.myAccount = true;
                    UserSvc.findOne(id).success(function(user){
                        $scope.user = user;
                    })

                    $scope.save = function() {
                        $scope.required.email = !$scope.user || !$scope.user.email ||!$scope.user.email.trim().length;
                        $scope.required.firstName = !$scope.user || !$scope.user.firstName ||!$scope.user.firstName.trim().length;
                        $scope.required.lastName = !$scope.user || !$scope.user.lastName ||!$scope.user.lastName.trim().length;           
                        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        $scope.valide.email = re.test($scope.user.email);
                         
                        if ($scope.valide.email && !$scope.required.email &&  !$scope.required.firstName && !$scope.required.lastName && !$scope.required.password) {
                         
                            UserSvc.edit($scope.user).success(function () {
                                $modalInstance.dismiss('cancel');
                                
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
        };

        function getUserInfos(cb){
            
            if(SessionStorageService.get('token')){
                Auth.isAlive().success(function(user){
                    $scope.user = user;
                    cb();
                });
            }
            else {
                $scope.user = {};
                cb();
            }
        }

        $rootScope.$on("loginlogout", function () {
            getUserInfos(buildMenus);
        });
        $rootScope.$on("editAccount", function () {
            getUserInfos(buildMenus);
        });

        $rootScope.$on('translateChangeSuccess', function () {
            buildMenus();
            $scope.currentLanguage =  SessionStorageService.get('lang');
        });

        $scope.logout = function() {
            if(SessionStorageService.get('token')){
                Auth.logout(function() {
                    SessionStorageService.delete('token');
                    $rootScope.$broadcast("loginlogout", {});
                    $state.go('home');
                }, function() {
                        $rootScope.error = gettextCatalog.getString('Invalid credentials');
                });
            }
        };

        $scope.showTasks = function(company,product,requirement,defect,notification){
          
             
            if($rootScope.notification>0 && !notification.isReaded ){
                $rootScope.notification--;
                var date = Date();
                notification.viewedAt = date;
               
            }
            notification.isReaded = true;
            //refreshNotification();
            NotificationSvc.edit(notification).success(function(response){

            })
            $state.go('product.tasks',{'company':company,'product':product,'requirement':requirement,'defect':defect});
        }
        
        $scope.showDetails = function(company,product,subproduct,requirement,defect,notification){
          
            $('.dropdown.keep-open').on({
                "shown.bs.dropdown": function() { this.closable = false; },
                "click":             function() { this.closable = true; },
                "hide.bs.dropdown":  function() { return this.closable; }
            });

            if($rootScope.notification>0 && !notification.isReaded ){
                $rootScope.notification--;
                var date = Date();
                notification.viewedAt = date;  
            }
            notification.isReaded = true;

            NotificationSvc.edit(notification).success(function(response){
            })
            $state.go('product.notificationdetails',{'company':company,'product':product,'subproduct':subproduct,'requirement':requirement,'defect':defect});
        }
        /*$scope.editUser = function(user) {


            var modalInstance = $modal.open({
                templateUrl: 'components/backoffice/user/views/user-account.html',
                size : 'lg',
                controller: function ($scope, $modalInstance) {
                 
                    $scope.save = function () {
                      
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });
        };
        */
        $scope.currentLanguage =  SessionStorageService.get('lang');
        $scope.changeLanguage = function (langKey) {
            gettextCatalog.setCurrentLanguage(langKey);
            SessionStorageService.put('lang' , langKey);
            $rootScope.$broadcast("translateChangeSuccess", {});
        };
        /*refreshNotification = function(){
           
             if(!$scope.currentUser.isSuperAdmin)
                    NotificationSvc.findNotification($scope.currentUser.company,$scope.currentUser.type,null).success(function(response){
                       response = _.sortBy(response,function(notification){
                            return notification.createdAt;
                          })
                       response = response.reverse();
                        var expNoti = false;
                        var allNoti = response;
                        response = _.filter(response,function(noti){
                             if(noti.viewedAt){
                                if((moment(noti.viewedAt).diff(noti.createdAt, 'days') - moment().isoWeekdayCalc(noti.viewedAt, noti.createdAt, [6, 7])) >= 1)
                                    {
                                        expNoti =true;
                                        return false;
                                    }
                             }
                             return true;
                        })
                        if(expNoti){
                            deleteNto = _.filter(allNoti,function(noti){
                             if(noti.viewedAt){
                                if((moment(noti.viewedAt).diff(noti.createdAt, 'days') - moment().isoWeekdayCalc(noti.viewedAt, noti.createdAt, [6, 7])) >= 1)
                                    {
                                        expNoti = true;
                                        return true;
                                    }
                             }
                             return false;
                           })
                            _.each(deleteNto,function(notifi){
                                NotificationSvc.delete(notifi._id).success(function(response){

                                });
                            })

                        }

                        

                        $rootScope.notification = 0;
                        if($scope.currentUser.type === 'manager'){

                            response = _.filter(response,function(element){
                                if(element.userType === 'manager')
                                    return true;
                            });

                            $rootScope.notification = _.filter(response,function(element){
                                    return !element.isReaded;
                            }).length;
                           
                            $rootScope.messages = [];
                            _.each(response,function(notification){
                                if(_.find(notification.product.subProducts,{'_id':notification.subproduct}))
                               var element = _.find(_.find(notification.product.subProducts,{'_id':notification.subproduct}).requirements,{'_id':notification.requirement});
                                    
                               
                                if(element && notification.defect){
                                    element = _.find(element.defects,{'_id':notification.defect});
                                }
                                var fields ="";
                                _.each(notification.subName,function(field){

                                    fields += " "+field;
                                    if(_.last(notification.subName) != field)
                                        field+=" and ";

                                })
                              
                                $rootScope.messages.push({'user' : notification.user,'all':notification,
                                                  'level':notification.name,'fields':fields,'date':notification.createdAt
                            });
                            })
                        }
                         else if($scope.currentUser.type === 'collaborator'){
                          
                            response = _.filter(response,function(element){
                                if(element.userType === 'collaborator' && $scope.currentUser._id === element.user._id)
                                    return true;
                            });

                            $rootScope.notification = _.filter(response,function(element){
                                    return !element.isReaded;
                             }).length;
                            $rootScope.messages = [];

                            _.each(response,function(notification){
                                if(_.find(notification.product.subProducts,{'_id':notification.subproduct}))
                               var element = _.find(_.find(notification.product.subProducts,{'_id':notification.subproduct}).requirements,{'_id':notification.requirement});
                                    var level="requirement";
                               
                                if(element && notification.defect){
                                    level="defect";
                                    element = _.find(element.defects,{'_id':notification.defect});
                                }
                                var fields ="";
                                _.each(notification.subName,function(field){

                                    fields += " "+field;
                                    if(_.last(notification.subName) != field)
                                        field+=" and ";

                                })
                              
                                $rootScope.messages.push({ 'product':notification.product.name,
                                                  'name':notification.name,'level':level,'fields':fields,'date':notification.createdAt,'all':notification
                            });
                            })
                        }
                    })
        }*/


        $scope.doYounWantToDelete = function(id){
          
            $('.dropdown.keep-open').on({
                "shown.bs.dropdown": function() { this.closable = false; },
                "click": function() { this.closable = false; },
                "hide.bs.dropdown":  function() { return this.closable; }
            });
            $scope.afterclicked[id] = true;
            
        }

        $scope.relache = function(){
            $('.dropdown.keep-open').on({
                "shown.bs.dropdown": function() { this.closable = false; },
                "click": function() { this.closable = true; },
                "hide.bs.dropdown":  function() { return this.closable; }
            });
        }

        $scope.canceldelete= function(id){
            
            $scope.afterclicked[id] = false;
            $('.dropdown.keep-open').on({
                "shown.bs.dropdown": function() { this.closable = false; },
                "click": function() { this.closable = true; },
                "hide.bs.dropdown":  function() { return this.closable; }
            });
        }

        $scope.deleteNoti = function (notis){
            $('.dropdown.keep-open').on({
                "shown.bs.dropdown": function() { this.closable = false; },
                "click": function() { this.closable = true; },
                "hide.bs.dropdown":  function() { return this.closable; }
            });

            _.each(notis,function(n){
                n.followers = _.reject(n.followers,function(f){ return f == $rootScope.currentUser._id});
                NotificationSvc.edit(n).success(_.noop);
            })

            loadnotifications();
        }

        loadnotifications = function(){

                if($rootScope.currentUser && !$rootScope.currentUser.isSuperAdmin)
                 NotificationSvc.findNotification($rootScope.currentUser._id).success(function(response){

                  response = _.reject(response,function(noti){
                    var datenow = new Date();


                    var duree = moment(datenow).diff(noti.createdAt, 'hours') - moment().isoWeekdayCalc(datenow,noti.createdAt, [6, 7])*24;
                    if(duree>24){

                        NotificationSvc.delete(noti._id).success(_.noop);
                        return true;
                    }
                        
                  })  
                    
                   /* response = _.sortBy(response,function(notification){
                        return notification.createdAt;
                    })
                    response = response.reverse();*/
                    response = _.groupBy(response,'element');
                    $rootScope.notis = response;
                    $rootScope.notiVisible = true;
                    
                })
                else if(!$rootScope.currentUser){
                      $rootScope.notiVisible = false;
                       $state.go($state.current.name);
                }
                else
                    $rootScope.notiVisible = false;


        }
        $scope.iniNotifcation = function(){

             $rootScope.socket = new io(null, {port: 2000});
             $rootScope.socket.connect();         
            $rootScope.socket.on('message', function(msg){
                loadnotifications();
               //refreshNotification();
            });
        }
        $scope.showNoti = function (notis){
            _.each(notis,function(noti){
                noti.isReaded = true;
                NotificationSvc.edit(noti).success(_.noop);
            })
            var noti = _.first(notis);
            if(noti.type == 'requirement')
                if(!($state.current.name === 'product.requirement'))
                    $state.go('product.requirement',{'company':noti.entity,'product':noti.product,'subproduct':noti.subproduct,'requirement':noti.requirement});
                else{
                    if($state.params.company === noti.entity && $state.params.product === noti.product && $state.params.subproduct === noti.subproduct && $state.params.requirement ==noti.requirement)
                        $rootScope.getRequirementDetail();
                    else
                        $state.go('product.requirement',{'company':noti.entity,'product':noti.product,'subproduct':noti.subproduct,'requirement':noti.requirement});
                }
                else
                {
                   if(!($state.current.name === 'product.defect'))
                    $state.go('product.defect',{'company':noti.entity,'product':noti.product,'subproduct':noti.subproduct,'defect':noti.defect});
                else{
                    if($state.params.company === noti.entity && $state.params.product === noti.product && $state.params.subproduct === noti.subproduct && $state.params.defect ==noti.v)
                        $rootScope.getDefectDetail();
                    else
                        $state.go('product.defect',{'company':noti.entity,'product':noti.product,'subproduct':noti.subproduct,'defect':noti.defect});
                
                }
            }
               
        }

        $scope.isReaded = function(noti){
            if(_.find(noti,{isReaded:false}))
                return false;
            return true;
        }

        $scope.notisdetails = function(notis){
            var affiched = [];
            var u = "";
            var nbelement = _.groupBy(notis,'user').length;
            var i = 1;
            _.each(notis,function(n){
               
                if(n.user){
                    if(affiched.indexOf(n.user._id) === -1){
                        u +=  " "+n.user.lastName+" ";
                        i++;
                        affiched.push(n.user._id);
                    }
                }
                else
                {
                    if(affiched.indexOf('-1') === -1){
                        u += " Super admin ";
                        i++;
                        affiched.push("-1");
                    }
                }

                if(i-1 < nbelement){

                    u += ",";
                }
                if(i-1 === nbelement)
                    u += " and ";
            })
            
            var noti = _.first(notis);
            

             
            var  message = u+" commented on "+noti.type+" ("+notis.length+")";
            return message;
        }
       
        $scope.getNotinumber = function(){
            return  _.filter($rootScope.notis, function(noti){ return !$scope.isReaded(noti)}).length;
        }
         


    }
);