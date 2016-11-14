angular
    .module("MainApp")
    .directive("popoverHtmlUnsafePopup", function () {
        return {
            restrict: "EA",
            replace: true,
            scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
            templateUrl: "components/shared/views/popover-html-unsafe-popup.html"
        };
    })
    .directive("popoverHtmlUnsafe", [ "$tooltip", function ($tooltip) {
        return $tooltip("popoverHtmlUnsafe", "popover", "click");
    }])
    .directive('datepickerPopup', function (){
        return {
            restrict: 'EAC',
            require: 'ngModel',
            link: function(scope, element, attr, controller) {
                //remove the default formatter from the input directive to prevent conflict
                controller.$formatters.shift();
            }
        }
    });