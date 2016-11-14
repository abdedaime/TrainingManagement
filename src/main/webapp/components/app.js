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
          })
    .run(function($rootScope, $location , SettingService, SessionStorageService, Auth, UserModel) {

        SettingService.translator.setLang();
        SettingService.populateRootScope();

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
           
           
        });
    });