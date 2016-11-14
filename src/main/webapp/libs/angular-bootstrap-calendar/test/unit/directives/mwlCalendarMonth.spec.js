'use strict';

var angular = require('angular'),
  moment = require('moment');

describe('mwlCalendarMonth directive', function() {
  var MwlCalendarCtrl,
    element,
    scope,
    $rootScope,
    directiveScope,
    showModal,
    calendarHelper,
    $templateCache,
    template =
      '<mwl-calendar-month ' +
      'events="events" ' +
      'current-day="currentDay" ' +
      'on-event-click="onEventClick" ' +
      'on-event-times-changed="onEventTimesChanged" ' +
      'day-view-start="dayViewStart" ' +
      'day-view-end="dayViewEnd" ' +
      'cell-is-open="cellIsOpen"' +
      'on-timespan-click="onTimeSpanClick"' +
      'day-view-split="dayViewSplit || 30" ' +
      'cell-template-url="{{ monthCellTemplateUrl }}" ' +
      'cell-events-template-url="{{ monthCellEventsTemplateUrl }}" ' +
      '></mwl-calendar-month>';
  var calendarDay = new Date(2015, 4, 1);

  function prepareScope(vm) {
    //These variables MUST be set as a minimum for the calendar to work
    vm.currentDay = calendarDay;
    vm.cellIsOpen = true;
    vm.dayViewStart = '06:00';
    vm.dayViewEnd = '22:00';
    vm.dayViewsplit = 30;
    vm.events = [
      {
        $id: 0,
        title: 'An event',
        type: 'warning',
        startsAt: moment(calendarDay).startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
        endsAt: moment(calendarDay).startOf('week').add(1, 'week').add(9, 'hours').toDate(),
        draggable: true,
        resizable: true
      }, {
        $id: 1,
        title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
        type: 'info',
        startsAt: moment(calendarDay).subtract(1, 'day').toDate(),
        endsAt: moment(calendarDay).add(5, 'days').toDate(),
        draggable: true,
        resizable: true
      }, {
        $id: 2,
        title: 'This is a really long event title that occurs on every year',
        type: 'important',
        startsAt: moment(calendarDay).startOf('day').add(7, 'hours').toDate(),
        endsAt: moment(calendarDay).startOf('day').add(19, 'hours').toDate(),
        recursOn: 'year',
        draggable: true,
        resizable: true
      }
    ];

    showModal = sinon.spy();

    vm.onEventClick = function(event) {
      showModal('Clicked', event);
    };

    vm.onTimeSpanClick = function(event) {
      showModal('Day clicked', event);
    };

    vm.onEventTimesChanged = function(event) {
      showModal('Dropped or resized', event);
    };
  }

  beforeEach(angular.mock.module('mwl.calendar'));

  beforeEach(angular.mock.inject(function($compile, _$rootScope_, _calendarHelper_, _$templateCache_) {
    $rootScope = _$rootScope_;
    $templateCache = _$templateCache_;
    calendarHelper = _calendarHelper_;
    scope = $rootScope.$new();
    prepareScope(scope);
    element = angular.element(template);
    element.data('$mwlCalendarController', {});
    element = $compile(element)(scope);
    scope.$apply();
    directiveScope = element.isolateScope();
    MwlCalendarCtrl = directiveScope.vm;
  }));

  it('should get the new month view when calendar refreshes and show the list of events for the current day if required', function() {
    var monthView = [{date: moment(calendarDay), inMonth: true}];
    sinon.stub(calendarHelper, 'getWeekDayNames').returns(['Mon', 'Tu']);
    sinon.stub(calendarHelper, 'getMonthView').returns(monthView);
    sinon.stub(calendarHelper, 'getWeekViewWithTimes').returns({event: 'event2'});
    scope.$broadcast('calendar.refreshView');
    expect(calendarHelper.getWeekDayNames).to.have.been.called;
    expect(calendarHelper.getMonthView).to.have.been.calledWith(scope.events, scope.currentDay);
    expect(MwlCalendarCtrl.weekDays).to.eql(['Mon', 'Tu']);
    expect(MwlCalendarCtrl.view).to.equal(monthView);
    expect(MwlCalendarCtrl.openRowIndex).to.equal(0);
    expect(MwlCalendarCtrl.openDayIndex).to.equal(0);
  });

  it('should toggle the event list for the selected day ', function() {
    MwlCalendarCtrl.view = [{date: moment(calendarDay), inMonth: true}];
    MwlCalendarCtrl.dayClicked(MwlCalendarCtrl.view[0]);
    //Open event list
    expect(MwlCalendarCtrl.openRowIndex).to.equal(0);
    expect(MwlCalendarCtrl.openDayIndex).to.equal(0);
    expect(showModal).to.have.been.calledWith('Day clicked', {
      calendarDate: MwlCalendarCtrl.view[0].date.toDate(),
      $event: undefined
    });

    //Close event list
    MwlCalendarCtrl.dayClicked(MwlCalendarCtrl.view[0]);
    expect(MwlCalendarCtrl.openRowIndex).to.equal(null);
    expect(MwlCalendarCtrl.openDayIndex).to.equal(null);
  });

  it('should disable the slidebox if the click event is prevented', function() {
    expect(MwlCalendarCtrl.openRowIndex).to.be.null;
    expect(MwlCalendarCtrl.openDayIndex).to.be.undefined;
    MwlCalendarCtrl.view = [{date: moment(calendarDay), inMonth: true}];
    MwlCalendarCtrl.dayClicked(MwlCalendarCtrl.view[0], false, {defaultPrevented: true});
    expect(MwlCalendarCtrl.openRowIndex).to.be.null;
    expect(MwlCalendarCtrl.openDayIndex).to.be.undefined;
  });

  it('should highlight an event across multiple days', function() {
    var monthView = [{
      date: moment(calendarDay),
      inMonth: true,
      events: [scope.events[0]]
    }, {
      date: moment(calendarDay),
      inMonth: true,
      events: [scope.events[0]]
    }, {
      date: moment(calendarDay),
      inMonth: true,
      events: [scope.events[1]]
    }];

    MwlCalendarCtrl.view = monthView;
    MwlCalendarCtrl.highlightEvent(scope.events[0], true);
    expect(monthView[0].highlightClass).to.equal('day-highlight dh-event-warning');
  });

  it('should call the callback function when you finish dropping an event', function() {
    MwlCalendarCtrl.handleEventDrop(scope.events[0], calendarDay);
    expect(showModal).to.have.been.calledWith('Dropped or resized', {
      calendarEvent: scope.events[0],
      calendarDate: new Date(2015, 4, 1),
      calendarNewEventStart: new Date(2015, 4, 1, 8, 0),
      calendarNewEventEnd: new Date(2015, 4, 10, 9, 0)
    });
  });

  it('should call the callback function when you finish dropping an event with no end date', function() {
    delete scope.events[0].endsAt;
    MwlCalendarCtrl.handleEventDrop(scope.events[0], calendarDay);
    expect(showModal).to.have.been.calledWith('Dropped or resized', {
      calendarEvent: scope.events[0],
      calendarDate: new Date(2015, 4, 1),
      calendarNewEventStart: new Date(2015, 4, 1, 8, 0),
      calendarNewEventEnd: null
    });
  });

  it('should use a custom cell url', function() {
    var templatePath = 'customMonthCell.html';
    $templateCache.put(templatePath, '<my-custom-cell>Hello world!</my-custom-cell>');
    scope.monthCellTemplateUrl = templatePath;
    MwlCalendarCtrl.cellModifier = angular.noop;
    scope.$broadcast('calendar.refreshView');
    scope.$apply();
    expect(element.find('my-custom-cell').length).to.be.at.least(1);
  });

  it('should use a custom cell events url', function() {
    var templatePath = 'customMonthCellEvents.html';
    $templateCache.put(templatePath, '<my-custom-events>Hello world!</my-custom-events>');
    scope.monthCellEventsTemplateUrl = templatePath;
    MwlCalendarCtrl.cellModifier = angular.noop;
    scope.$broadcast('calendar.refreshView');
    scope.$apply();
    expect(element.find('my-custom-events').length).to.be.at.least(1);
  });

});
