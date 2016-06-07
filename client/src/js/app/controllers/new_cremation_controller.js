(function(){
'use strict';

angular.module('demoApp')
    .controller('newCremationController', ['$scope', '$rootScope', 'Crematorium', newCremationController]);

    function newCremationController ($scope, $rootScope, Crematorium) {
        var vm = this;

        vm.currentDate = new Date();

        vm.cremation = {
            deceased: {
                first_name: '',
                last_name: '',
                middle_name: '',
                gender: '',
                date_of_birth: '',
                date_of_death: '',
            },
            date_cremated: '',
            time_started: '',
            time_finished: '',
            gas_consumed: ''
        };

        vm.cremationDates = {
            date_of_birth: '',
            date_of_death: '',
            time_started: '',
            time_finished: '',
        };

        vm.initialize = initialize;
        vm.save = save;
        vm.close = close;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $scope.$watch(function () {
                return vm.cremationDates.date_cremated;
            }, function (newDate, oldDate) {
                if (!newDate || newDate === oldDate) return;
                vm.cremation.date_cremated = newDate.getFullYear() + '-' +
                    (newDate.getMonth() + 1) + '-' +
                    newDate.getDate();
            });

            $scope.$watch(function () {
                return vm.cremationDates.date_of_birth;
            }, function (newDate, oldDate) {
                if (!newDate || newDate === oldDate) return;
                vm.cremation.deceased.date_of_birth = newDate.getFullYear() + '-' +
                                            (newDate.getMonth()+1) + '-' +
                                            newDate.getDate();
            });

            $scope.$watch(function () {
                return vm.cremationDates.date_of_death;
            }, function (newDate, oldDate) {
                if (!newDate || newDate === oldDate) return;
                vm.cremation.deceased.date_of_death = newDate.getFullYear() + '-' +
                    (newDate.getMonth() + 1) + '-' +
                    newDate.getDate();
            });

            $scope.$watch(function(){
                return vm.cremationDates.time_started;
            }, function(newDate, oldDate) {
               if(!newDate || newDate === oldDate) return;
               vm.cremation.time_started = newDate.getHours() + ':' + newDate.getMinutes();
            });

            $scope.$watch(function () {
                return vm.cremationDates.time_finished;
            }, function (newDate, oldDate) {
                if (!newDate || newDate === oldDate) return;
                vm.cremation.time_finished = newDate.getHours() + ':' + newDate.getMinutes();
            });
        }

        function save () {
            console.log('save new cremation: ', vm.cremation);
            Crematorium.customPOST(vm.cremation)
                .then(function(response){
                   console.log('saved cremation: ', response.cremation);
                    $rootScope.cremations.push(response.cremation);
                    close();
                },function(error){
                    console.log('error saving cremation: ', error);
                });
        }

        function close () {
            $rootScope.showNewCremationFormPanel = false;
        }
    }
}());