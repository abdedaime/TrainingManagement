angular
    .module('MainApp')
    .controller('ActionCtrl', function($scope, $rootScope, $modal, $filter, $state, Auth, ProductSvc, RoleSvc, UserSvc, CompanySvc, NotificationSvc, ActionSvc) {

        $scope.now = new Date();
        $scope.menuactive = "";
        $scope.oldDate;
        $scope.years = [];
        $scope.months = {};
        $scope.byMonths = {};
        $scope.dateToShow = {
            yesterday: {},
            thisweek: {},
            thisMonth: {}
        };
        $scope.showOld = {}; 
        $scope.showToday = {};
        $scope.showYesterday = {};
        $scope.showThisweek = {};
        $scope.showThismonth = {};
        $scope.allActions = {};
        $scope.filter = {};
        $scope.elementToDelete = [];
        $scope.history = {
            toDay: [],
            currentVisible: [],
            yesterday: [],
            thisWeek: [],
            thisMonth: [],
            byMonths: []
        };
        $scope.currentMonth = {};
        $scope.users = [];

          getUsers = function() {
            UserSvc.findAll().success(function(users) {
                $scope.users = users;
                var user = _.find($scope.users, {
                    'email': $scope.currentUser.email
                });
                /*if (user) {
                    user.firstName = "  ";
                    user.lastName = " Me ";
                }*/

            })
        }

        getUsers();
        getOldAction = function() {
            ActionSvc.getOldAction().success(function(action) {
                if (action)
                    $scope.oldDate = action.createdAt;
            })
        }
         $scope.getuser = function(id) {
            return _.find($scope.users, {
                '_id': id
            });
        }

        $scope.storeAllActions = function() {
            ActionSvc.getAll().success(function(actions) {
                $scope.allActions = actions;
            })
        }

        $scope.storeAllActions();

        $scope.addTodelete = function(id) {
            if ($scope.elementToDelete.indexOf(id) != -1)
                $scope.elementToDelete.splice($scope.elementToDelete.indexOf(id), 1);
            else
                $scope.elementToDelete.push(id)
        }

        $scope.addAll = function() {
            if ($scope.elementToDelete.length === $scope.history.currentVisible.length)
                $scope.elementToDelete = [];
            else {
                $scope.elementToDelete = [];
                _.each($scope.history.currentVisible, function(action) {
                    $scope.elementToDelete.push(action._id)
                })
            }
        }

        function getElementToDelet() {
            return $scope.elementToDelete;
        }

        refreshAction = function() {
            $scope.getHistory($scope.menuactive);
        }

        $scope.deleteAction = function() {

            var modalInstance = $modal.open({
                templateUrl: 'components/frontoffice/action/views/action-delete.html',
                controller: function($scope, $modalInstance, $location) {
                    $scope.elementToDelete = getElementToDelet();
                    $scope.save = function() {

                        _.each($scope.elementToDelete, function(action) {
                            ActionSvc.delete(action).success(_.noop);
                        })
                        refreshAction();
                        $modalInstance.dismiss('ok');

                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });
        };

        $scope.getProgress = function (element){
             if (element.state === 'Fixed') {
                element.progress = 100;
                return 100;
            } else if (element.remaining_estimation && element.estimation)
                if (element.remaining_estimation.value) {

                    var remaining_timeHours = element.remaining_estimation.value;
                    var estimationHours = element.estimation;
                    if (element.unit == 'days')
                        estimationHours *= 24;
                    if (element.remaining_estimation.unit === 'days')
                        remaining_timeHours *= 24;
                    var tmp = ((estimationHours - remaining_timeHours) / estimationHours * 100);
                    if (tmp < 0) {

                        return 0;

                    }


                    element.progress = Math.round(tmp);
                    return element.progress;

                }
            return 0;
        }

        $scope.$watch('filter', function(newVal, oldVal) {
            if (newVal && oldVal && newVal != oldVal) {

                if (newVal.query) {

                    $scope.history.currentVisible = _.filter($scope.allActions, function(action) {
                        return action.old.name.indexOf(newVal.query) != -1
                    })
                }
                else {
            
                     $scope.getHistory($scope.menuactive);
               
               }

            } else {
                     $scope.getHistory($scope.menuactive);
            

            }
        }, true)

        getOldAction();


        refresh = function(start, end, tab) {
            ActionSvc.getAction(start, end).success(function(actions) {
                $scope.history.currentVisible = actions;
            })
        }

        getActions = function(start, end,element) {
            
            ActionSvc.getAction(start, end).success(function(actions) {
                element = actions;
               // console.log("hh",element)
            })
            
        }

        getdiff = function(element1, element2, isSuproduct) {
            var tab = [];
            if (element1.name != element2.name)
                tab.push('name');
            if (element1.description != element2.description)
                tab.push('description');
            if (!isSuproduct) {
                if (element1.priority != element2.priority)
                    tab.push('priority');

                if (element1.severity != element2.severity)
                    tab.push('severity');

                if (element1.estimation != element2.estimation)
                    tab.push('estimation');
                if (element1.unit != element2.unit)
                    tab.push('unit');
                if (element1.remaining_estimation.value != element2.remaining_estimation.value)
                    tab.push('remaining estimation ');
                if (element1.remaining_estimation.unit != element2.remaining_estimation.unit)
                    tab.push('remaining estimation unit');
            }

            if (element1.files.length != element2.files.length)
                tab.push('files');
            if (!isSuproduct)
                if (element1.assignTo != element2.assignTo) {

                    tab.push('assigned to ' + $scope.getuser(element2.assignTo).firstName + ' ' + $scope.getuser(element2.assignTo).lastName);
                }

            return tab;
        }

        diffToString = function(element, oldelement, ele) {
            var isSuproduct = (ele === 'subproduct');
            var tab = getdiff(element, oldelement, isSuproduct);
            if (tab.length == 0)
                return "";
            var fields = "<span class='field_deco'>" + tab[0] + "</span>";
            var i = 0;
            for (i = 1; i < tab.length - 1; i++)
                fields += ", <span class='field_deco'>" + tab[i] + "</span>"
            if (tab[i] && i > 0)
                fields += " and <span class='field_deco'>" + tab[i] + "</span>";

            return fields;
        }

        $scope.getLabelPriority = function(priority) {
            switch (priority) {
                case 'Low':
                    return 'label label-success';
                case 'Medium':
                    return 'label label-warning';
                case 'High':
                    return 'label label-danger';
                default:
                    return '';
            }
        }

        getElement = function(tabs, id) {
            return _.find(tabs, {
                '_id': id
            });
        }

        getRequirement = function(product, id) {
            if (getElement(product.requirements, id))
                return getElement(product.requirements, id);
            _.each(product.subProducts, function(subproduct) {
                if (getElement(subproduct.requirements, id))
                    return getElement(subproduct.requirements, id);
            })
        }

        $scope.getSubproduct = function(product, id) {
            return getElement(product.subProducts, id);

        }

        $scope.getDefect = function(product, id) {
            if (getElement(product.actions, id))
                return getElement(product.actions, id);

            _.each(product.subProducts, function(subproduct) {
                if (getElement(subproduct.actions, id))
                    return getElement(subproduct.actions, id);
                _.each(subproduct.requirements, function(req) {
                    if (getElement(req.actions, id))
                        return getElement(req.actions, id);
                })
            })
        }

        $scope.getLabelSeverity = function(priority) {
            switch (priority) {
                case 'Minor':
                    return 'label label-yellow';
                case 'Major':
                    return 'label label-warning';
                case 'Bloquant':
                    return 'label label-danger';

                case 'Cosmetic':
                    return 'label label-success';
                default:
                    return '';
            }
        }
        getLabelsDate = function() {
            var start = $scope.now.toISOString();
            var end = $scope.now.toISOString();

            $scope.dateToShow['yesterday'].start = moment().subtract('day', 1).toISOString();

            $scope.dateToShow['thisweek'].start = moment().subtract('day', 7).toISOString();
            $scope.dateToShow['thisweek'].end = end;
            var x = new Date(end).setDate(moment().daysInMonth());
            var y = new Date().setDate(1);


            $scope.dateToShow['thisMonth'].start = y;
            $scope.dateToShow['thisMonth'].end = x;
        }
        getLabelsDate();

        actionIn = function(){
        
                    getActions($scope.now.toISOString(), $scope.now.toISOString());
                    getActions($scope.dateToShow['yesterday'].start, $scope.dateToShow['yesterday'].start,$scope.showYesterday);
                    getActions($scope.dateToShow['thisweek'].start, $scope.dateToShow['thisweek'].start,$scope.showThisweek);
                    getActions($scope.dateToShow['thisMonth'].start, $scope.dateToShow['thisMonth'].start,$scope.showThisweek,$scope.showThismonth);

//                   $scope.showThismonth =  getActions(start, end,$scope.showThismonth);

                  /* start = $scope.now.toISOString();
                    end = $scope.now.toISOString();
                   $scope.showOld = false;
                    ActionSvc.getAll().success(function(actions) {
                        $scope.history.byMonths = _.sortBy(actions, function(action) {
                           if(action.length>0)
                             $scope.showOld = true;
                        })
                    })*/
        }

        actionIn();

        $scope.getHistory = function(menu) {
            $scope.history = {};
            var start = $scope.now.toISOString();
            var end = $scope.now.toISOString();

            switch (menu) {
                case 'today':
                    start = $scope.now.toISOString();
                    refresh(start, end, $scope.history.toDay);

                    break;
                case 'yesterday':

                    start = moment().subtract('day', 1).toISOString();
                    $scope.dateToShow.start = start;
                    refresh(start, start, $scope.history.yesterday);

                    break;
                case 'thisweek':
                    start = moment().subtract('day', 7).toISOString();
                    $scope.dateToShow.start = start;
                    $scope.dateToShow.end = end;
                    refresh(start, end, $scope.history.thisWeek);

                    break;
                case 'thisMonth':

                    var y = new Date(start).setDate(1);
                    var x = new Date(end).setDate(moment().daysInMonth());

                    start = new Date(y).toISOString();
                    end = new Date(end).toISOString();
                    $scope.dateToShow.start = start;
                    $scope.dateToShow.end = end;
                    refresh(start, end, $scope.history.thisMonth);

                    break;
                case 'byMonths':
                    ActionSvc.getAll().success(function(actions) {
                        $scope.history.byMonths = _.sortBy(actions, function(action) {
                            return new Date(action.createdAt).getMonth()
                        })


                        $scope.history.byMonths = _.groupBy($scope.history.byMonths, function(action) {
                            return new Date(action.createdAt).getFullYear();
                        });
                        $scope.years = _.keys($scope.history.byMonths);
                        $scope.years = _.sortBy($scope.years,function(y){ return -parseInt(y)})
                    })

                    break;
            }
            $scope.menuactive = menu;
        }

        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        $scope.showAction = function(y, m) {
            $scope.history.currentVisible = $scope.byMonths[y][m];

        }

      
        
       
        $scope.getActionByMonths = function(years) {
            $scope.byMonths[years] = _.groupBy($scope.history.byMonths[years], function(y) {
                return monthNames[new Date(y.createdAt).getMonth()]
            });
            $scope.months[years] = _.keys($scope.byMonths[years]);
        }

        $scope.getActionDescription = function(action) {
            switch (action.type) {
                case 'add':
                    return "has created a new " + action.element + " named <b>" + action.old.name + "</b>";

                case 'edit':
                    return "has modify " + diffToString(action.last, action.old, action.element) + " of a " + action.element + " named <b>" + action.old.name + "</b>";
                case 'delete':
                    return "has deleted " + action.element + " named <b>" + action.old.name + "</b>";

                case 'requirementToRequirement':
                    var message = "has changed the action named <b>" + action.old.name + "</b> from a requirement to another requirement ";
                    if (diffToString(action.last, action.old, action.element))
                        message += "and changes " + diffToString(action.last, action.old, action.element);
                    return message;
                case 'subproductToSubproduct':
                    var message = "has changed the " + action.element + " named <b>" + action.old.name + "</b> from a subproduct to another subproduct ";
                    if (diffToString(action.last, action.old, action.element))
                        message += "and changes " + diffToString(action.last, action.old, action.element);
                    return message;

                case 'requirementToSubproduct':
                    var message = "has changed the action named <b>" + action.old.name + "</b> from the the requirement to subproduct    ";
                    if (diffToString(action.last, action.old, action.element))
                        message += "and changes " + diffToString(action.last, action.old, action.element);
                    return message;

                case 'subproductToRequirement':
                    var message = "has changed the action named <b>" + action.old.name + "</b> from the the  subproduct  to requirement ";
                    if (diffToString(action.last, action.old, action.element))
                        message += "and changes " + diffToString(action.last, action.old, action.element);
                    return message;

                case 'productToRequirement':
                    var message = "has changed the action named <b>" + action.old.name + "</b> from the the  product  to requirement ";
                    if (diffToString(action.last, action.old, action.element))
                        message += "and changes " + diffToString(action.last, action.old, action.element);
                    return message;

                case 'requirementToProduct':
                    var message = "has changed the action named <b>" + action.old.name + "</b> from the the requirement to product";
                    if (diffToString(action.last, action.old, action.element))
                        message += "and changes " + diffToString(action.last, action.old, action.element);
                    return message;
                case 'productToSubproduct':
                    var message = "has changed the " + action.element + " named <b>" + action.old.name + "</b> from the the  product  to a subproduct ";
                    if (diffToString(action.last, action.old, action.element))
                        message += "and changes " + diffToString(action.last, action.old, action.element);
                    return message;

                case 'subproductToProduct':
                    var message = "has changed the " + action.element + " named <b>" + action.old.name + "</b> from the the  subproduct  to a product ";
                    if (diffToString(action.last, action.old, action.element))
                        message += "and changes " + diffToString(action.last, action.old, action.element);
                    return message;

                case 'change':
                    var type = action.element = 'action';
                    if (action.element === 'action')
                        type = 'requirement';
                    var message = "has changed the " + action.element + " named <b>" + action.old.name + "</b> to a  " + type;
                    if (diffToString(action.last, action.old, action.element))
                        message += "and changes " + diffToString(action.last, action.old, action.element);
                    return message;

            }
        }

    })