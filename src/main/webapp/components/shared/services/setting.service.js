angular.module('MainApp')
    .factory('SettingService', function(gettextCatalog, SessionStorageService, $rootScope, ConfigService){
        return  {
            translator : {
                setLang : function()
                {
                    var currentLang = SessionStorageService.get('lang');
                    gettextCatalog.currentLanguage = currentLang ? currentLang : SessionStorageService.put('lang' , 'en');
                }
            },
            populateRootScope : function(){
                ConfigService.getPublic().success(function(config){
                    var data = [{
                        "key" : "_",
                        "value" : _
                    },{
                        "key" : "global",
                        "value" : CONSTANTS
                    },{
                        "key" : "config",
                        "value" : config
                    }]
                    _.each(data,function(d){
                        $rootScope[d.key] = d.value;
                    })
                })
            }
        }

    });