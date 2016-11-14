angular.module('MainApp')
    .factory('ActionSvc', function($http){
        return  {
            find : function(id){
                return $http.get('/api/actions/'+id);
            },
            create : function(action){
                return $http.post('/api/actions',action);
            },
            edit : function(action){
                return $http.put('/api/actions/'+action._id,action);
            },
            delete : function(id){
                return $http.delete('/api/actions/'+id);
            },
            getAction : function(start,end){
                return $http.get('/api/actions/between/'+start+'/'+end);
            },
            getAll : function (){
                return $http.get('/api/actions');
            },
            getOldAction : function (){
                return $http.get('/api/action/oldest');
            }
           
            
        }
    });