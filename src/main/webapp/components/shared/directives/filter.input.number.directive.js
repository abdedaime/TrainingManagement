angular
    .module('MainApp')
    .directive('restrict', function($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, iElement, iAttrs, controller) {
            scope.$watch(iAttrs.ngModel, function(newVal,oldval) {
                
                if(newVal != oldval)
                {   
                    if (!newVal) {
                         return;
                    }
                    $parse(iAttrs.ngModel).assign(scope, newVal.toString().toLowerCase().replace(new RegExp(iAttrs.restrict, 'g'), '').replace(/\s+/g, '-'));
                }
            });
        }
    }
});