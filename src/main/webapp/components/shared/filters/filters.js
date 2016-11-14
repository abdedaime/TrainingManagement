angular
    .module('MainApp')
    .filter('capitalize', function() {
        return function(input) {
            if (input!=null)
                input = input.toLowerCase();
            return input.substring(0,1).toUpperCase()+input.substring(1);
        }
    })
    .filter('changeDisplay', function($rootScope){
        return function(status){
            if(!status) return;
            return $rootScope.currentUser.entity ? CONSTANTS.event.status.display[status][$rootScope.currentUser.entity.type] : status;
        };
    })
    .filter('filterByLang', function(SessionStorageService) {
        return function(array) {
            return _.filter(array,function(name){
                return !name.lang || !_.isObject(name.lang)|| name.lang.code === SessionStorageService.get('lang');
            })
        }
    })
    .filter('propsFilter', function() {
      return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
          items.forEach(function(item) {
            var itemMatches = false;

            var keys = Object.keys(props);
            for (var i = 0; i < keys.length; i++) {
              var prop = keys[i];
              var text = props[prop].toLowerCase();
              if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                itemMatches = true;
                break;
              }
            }

            if (itemMatches) {
              out.push(item);
            }
          });
        } else {
          // Let the output be the input untouched
          out = items;
        }

        return out;
      };
    })
