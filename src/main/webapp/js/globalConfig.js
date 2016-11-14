(function(exports) {

    var config = {
        languages: [{
            code: 'en',
            name: 'English'
        }, {
            code: 'fr',
            name: 'French'
        }],
        company: {
            sectors: ['Manufacturing', ' Call centers', ' Food & Beverage', ' School & Universities', 'Real Estate',
                'Law Firm', 'Manpower & Services', 'Banking & Finance', ' Pharma/ Medical', 'NGOs',
                'GOvt entities', 'Automotive', 'Airlines', 'Broker', ' Power & Energy',
                'Transport/ shipping', 'Utilities/ Logistics', 'Embassy', 'Insurance', 'Hotel', 'Telecoms', 'State Enterprise'
            ]
        },
        defectStates : [
                {
                  name : "Open",
                  icon : "",
                  description : "The issue is open and ready for the assignee to start work on it"
                },
                {
                  name : "In Progress",
                  icon : "",
                  description : "The issue is being actively worked on at the moment by the assignee"
                },
                {
                  name : "Reopened",
                  icon : "",
                  description : "The issue was once resolved, but the resolution was deemed incorrect From here issues are either marked assigned or resolved"
                },
                {
                  name : "Fixed",
                  icon : "",
                  description : "A resolution has been token, and it is waiting verification by reporter, From here issues are either reponed or are closed"
                },
                {
                  name : "Closed",
                  icon : "",
                  description : "The issue is considered finished, the resolution is correct, issues which are closed can be reopend"
                }
        ],
          requirementStates : [
                {
                  name : "Open",
                  icon : "",
                  description : "The requirement is open and ready for the assignee to start work on it"
                },
                {
                  name : "In Progress",
                  icon : "",
                  description : "The requirement is being actively worked on at the moment by the assignee"
                },
                {
                  name : "Reopened",
                  icon : "",
                  description : "The requirement was once resolved, but the resolution was deemed incorrect From here issues are either marked assigned or resolved"
                },
                {
                  name : "Fixed",
                  icon : "",
                  description : "A requirement has been token, and it is waiting verification by reporter, From here issues are either reponed or are closed"
                },
                {
                  name : "Closed",
                  icon : "",
                  description : "The requirement is considered finished, the resolution is correct, issues which are closed can be reopend"
                }
        ],
        unities : [
          {name:'day',value:'days'},
          {name:'hour',value:'hours'},

        ],
        severities : [
                     {name : "Minor" },{ name : "Major" },{ name :"Bloquant" },{ name :"Cosmetic"}
        ],
        priorities : [
                     {name : "Low" },{ name : "Medium" },{ name :"High" }
        ],
        entities : [
                        { name :'company',
                          admin :true,
                        },
                        { name :'role',
                          admin :true,
                        },
                        { name :'user',
                          admin :true,
                        },
                        { 
                          name :'product',
                          dependances : ['GET_USER','GET_COMPANY'],
                          admin :false,
                        },
                        
                    ],
        rights : [
                    {
                    "code": "POST",
                    "label": "Create "
                    },
                    {
                      "code": "PUT",
                      "label": "Edit "
                    },
                    {
                      "code": "DELETE",
                      "label": "Delete "
                    },
                    {
                      "code": "GET",
                      "label": "View "
                    }
        ]
    }
    exports.languages = config.languages;
    exports.company = config.company;
    exports.entities = config.entities;
    exports.rights = config.rights;
    exports.defectStates = config.requirementStates;
    exports.requirementStates = config.defectStates;
    exports.severities = config.severities;
    exports.priorities = config.priorities;
    exports.unities = config.unities;

})(typeof exports === 'undefined' ? this['CONSTANTS'] = {} : exports);