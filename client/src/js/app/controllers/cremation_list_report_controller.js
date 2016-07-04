(function(){
'use strict';

angular.module('demoApp')
    .controller('cremationListReportController', ['$scope', '$mdDialog', 'BASE_URL', cremationListReportController]);

    function cremationListReportController ($scope, $mdDialog, BASE_URL) {
        var vm = this;

        vm.maxDate = new Date();

        vm.reportDate = {
          start: null,
          end: null
        };

        vm.reportDateData = {
            start: null,
            end: null
        };

        vm.initialize = initialize;
        vm.generateReport = generateReport;
        vm.cancel = cancel;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $scope.$watch(function(){
               return vm.reportDate.start;
            }, function(newValue, oldValue){
                if(newValue === oldValue) return;
                vm.reportDateData.start = parseDate(vm.reportDate.start);
            });

            $scope.$watch(function () {
                return vm.reportDate.end;
            }, function (newValue, oldValue) {
                if (newValue === oldValue) return;
                vm.reportDateData.end = parseDate(vm.reportDate.end);
            });
        }

        function parseDate(date) {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        }

        function getDatesForUrl () {
            return '?start='+vm.reportDateData.start+'&end='+vm.reportDateData.end;
        }

        function generateReport () {
            var datesUrl = getDatesForUrl();
            window.open(BASE_URL + '/reports/cremation_list' + datesUrl);
            $mdDialog.hide();
        }

        function cancel () {
            $mdDialog.cancel();
        }

        /* Non Scope Functions here */

    }
}());