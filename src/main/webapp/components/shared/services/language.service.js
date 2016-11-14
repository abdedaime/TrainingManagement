angular.module('MainApp')
    .factory('LanguageSvc', function($http){
        return {
            findAll : function(){
                return $http.get('/api/languages');
            },
            findById : function(id){
                return $http.get('/api/languages/'+id);
            },
            findCodesByIds : function(ids){
                return $http.get('/api/languages/codes/'+ids);
            }
        }
    });