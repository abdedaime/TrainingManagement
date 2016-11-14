angular.module('MainApp')
    .factory('CountrySvc', function($http){
        return {
            findAll : function(){
                return $http.get('/api/countries');
            }
        }
    });