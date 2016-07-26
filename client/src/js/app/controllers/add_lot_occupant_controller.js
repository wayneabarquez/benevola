(function () {
    'use strict';

    angular.module('demoApp')
        .controller('addLotOccupantController', ['$rootScope', '$scope', '$mdDialog', 'lot', 'dateUtils', 'modalServices', addLotOccupantController]);

    function addLotOccupantController($rootScope, $scope, $mdDialog, lot, dateUtils, modalServices) {
        var vm = this;

        vm.lot = null;
        vm.occupant = {};

        vm.save = save;
        vm.cancel = cancel;
        vm.clearForm = clearForm;


        $scope.maxDate = new Date();

        /* Controller Functions here */

        function save() {
            if($scope.newForm.$valid) {
                vm.lot.post('deceased', vm.occupant)
                    .then(function (response) {
                        console.log('New Deceased: ', response);
                        $mdDialog.hide();
                        // TODO fetch new lot info via http request
                        vm.lot.status = 'occupied'; // TODO extract to constant

                        if (!vm.lot.c_no)
                            $rootScope.$broadcast('update-lot-detail', {lot: vm.lot});
                        else
                            modalServices.showColumbaryList();
                    }, function (err) {
                        console.log('Error adding new deceased: ', err);
                    });
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function clearForm() {
            vm.occupant = {};
            $scope.newForm.$setPristine();
        }

        function initialize() {
            vm.lot = lot;

            $scope.$watch(function () {
                return vm.occupant.date_of_birth_obj;
            }, function (newValue) {
                if (!newValue || !newValue instanceof Date) return;
                vm.occupant.date_of_birth = dateUtils.parseDateToISOString(newValue);
            });

            $scope.$watch(function () {
                return vm.occupant.date_of_death_obj;
            }, function (newValue) {
                if (!newValue || !newValue instanceof Date) return;
                vm.occupant.date_of_death = dateUtils.parseDateToISOString(newValue);
            });
        }

        initialize();
    }
}());