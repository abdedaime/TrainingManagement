angular.module('MainApp')
    .factory('UserSvc', function($http){
        return  {
            findAll : function(company){
                return $http.post('/api/usersbycompany',company);
            },
            findOne : function(id){
                return $http.get('/api/users/'+id);
            },
            create : function(user){
                return $http.post('/api/users',user);
            },
            edit : function(user){
                return $http.put('/api/users/'+user._id,user);
            },
            delete : function(id){
                return $http.delete('/api/users/'+id);
            },
            paginate : function(page, limit, pattern){
                return $http.post('/api/users/'+page+'/'+limit, pattern);
            }
        }
    });