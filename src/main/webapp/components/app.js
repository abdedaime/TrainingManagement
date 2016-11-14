angular
    .module('MainApp',
        [
            'ui.router', 'ngResource', 'ngCookies','ui.bootstrap','gettext','ngSanitize','toggle-switch','ui.select','angularFileUpload','ngAnimate','ngMaterial','angular-svg-round-progress','wysiwyg.module'
        ]
    )
    .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push('TokenInterceptor');

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'components/partials/home/home.html',
                
            })
            // Admin Application
            .state('admin', {
                url: '/admin',
                templateUrl: 'components/backoffice/admin/views/admin.html',
                controller: 'AdminCtrl',
                right : 'GET_ADMIN'
                
            })
            .state('admin.config', {
                url: '/config',
                templateUrl: 'components/backoffice/config/views/config.html',
                controller: 'ConfigCtrl',
                right : 'GET_CONFIG'
                
            })
            .state('admin.users', {
                url: '/users',
                templateUrl: 'components/backoffice/user/views/users.html',
                controller: 'UserCtrl',
                right : 'GET_USER'
                
            })
            .state('admin.roles', {
                url: '/roles',
                templateUrl: 'components/backoffice/role/views/roles.html',
                controller: 'RoleCtrl',
                right : 'GET_ROLE'
            })
            .state('admin.companies', {
                url: '/companies',
                templateUrl: 'components/backoffice/company/views/companies.html',
                controller: 'CompanyCtrl',
                right : 'GET_COMPANY'
            })
            .state('product', {
                url: '/products',
                templateUrl: 'components/frontoffice/product/views/home-head.html',
                controller: 'ProductHeadCtrl',
                right : 'GET_PRODUCT'
                
            })
            .state('product.home', {
                url: '/home/:company',
                templateUrl: 'components/frontoffice/product/views/home.html',
                controller: 'ProductCtrl',
                right : 'GET_PRODUCT'
                
            })
            .state('product.products', {
                url: '/:company/product/:product',
                templateUrl: 'components/frontoffice/product/views/products.html',
                controller: 'ProductsCtrl',
                right : 'GET_PRODUCT'
                
            })
            .state('product.defects', {
                url: '/:company/defects/:product',
                templateUrl: 'components/frontoffice/product/views/product-defects.html',
                controller: 'DefectsCtrl',
                right : 'GET_PRODUCT'
                
            })
            .state('product.analyse', {
                url: '/analyse/:company/product/:product',
                templateUrl: 'components/frontoffice/product/views/analyse/analyse.html',
                controller: 'AnalyseCtrl',
                right : 'GET_PRODUCT'
                
            })
             .state('product.tasks', {
                url: '/tasks/:company/1/:product/2/:requirement/3/:defect',
                templateUrl: 'components/frontoffice/product/views/collaborator.view.html',
                controller: 'TasksCtrl',
                right : 'GET_PRODUCT'
                
            })
             .state('product.notificationdetails', {
                url: '/notifications/:company/1/:product/2/:subproduct/3/:requirement/4/:defect',
                templateUrl: 'components/frontoffice/product/views/product-notification-details.html',
                controller: 'NotificationDetailsCtrl',
                right : 'GET_PRODUCT'
                
            })
             .state('product.requirement', {
                url: '/requirement/:company/1/:product/2/:subproduct/3/:requirement',
                templateUrl: 'components/frontoffice/product/views/functionality-product/functionality-product-show.html',
                controller: 'RequirementCtrl',
                right : 'GET_PRODUCT'
            })
             .state('product.defect', {
                url: '/defect/:company/1/:product/2/:subproduct/3/:defect',
                templateUrl: 'components/frontoffice/product/views/defect-product/defect-product-show.html',
                controller: 'DefectCtrl',
                right : 'GET_PRODUCT'
                
            })
             .state('history', {
                url: '/history',
                templateUrl: 'components/frontoffice/action/views/actions.html',
                controller: 'ActionCtrl',
                right : 'GET_PRODUCT'
                
            })
    })
    .run(function($rootScope, $location , SettingService, SessionStorageService, Auth, UserModel) {

        SettingService.translator.setLang();
        SettingService.populateRootScope();

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
           
            if(SessionStorageService.get('token')){
                Auth.isAlive().success(function(user){
                if(!_.isEmpty(toParams.company) && !user.isSuperAdmin)
                  if(!_.find(user.companies,function(c){ return c._id === toParams.company}))
                     $location.path('/');
                if(['admin','product.home','product.products','product.analyse','product.defects','product.tasks'].indexOf(toState.name) != -1)
                   $rootScope.state_active = toState.name;
                else if(['admin.config','admin.users','admin.companies','admin.roles'].indexOf(toState.name) != -1)
                    $rootScope.state_active = 'admin';
                else if(toState.name === "history")
                    $rootScope.state_active = "history";
                else{
                   $rootScope.state_active = "";
                   }
                    $rootScope.currentUser = UserModel.bootstrap(user);
                        if(!$rootScope.currentUser.isAuthorized(toState.right))
                        {    
                          $location.path('/');
                        }
                })
            }
        });
    });