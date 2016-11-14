angular
    .module('MainApp')
    .factory('UserModel', function($rootScope,NotificationSvc){
        return {
            bootstrap : function(user){
            	user.isAuthorized = function(code){
                    if(!user.isSuperAdmin && !user.role)
                        return false; 
            		return user.isSuperAdmin || user.role.rights.indexOf(code) !== -1;
            	}

                return user;
            }


        }
    });