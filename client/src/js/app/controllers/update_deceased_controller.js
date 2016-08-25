(function () {
    'use strict';

    angular.module('demoApp')
        .controller('updateDeceasedController', ['deceased', '$scope', 'dateUtils', 'modalServices', updateDeceasedController]);

    function updateDeceasedController(deceased, $scope, dateUtils, modalServices) {
        var vm = this;

        vm.deceased = {};

        vm.save = save;
        vm.cancel = cancel;
        vm.clearForm = clearForm;


        $scope.maxDate = new Date();

        /* Controller Functions here */

        function save() {
            vm.deceased.put()
                .then(function (response) {
                    vm.deceased = response.deceased;
                    modalServices.hideResolve(response);
                }, function (err) {
                    console.log('Error Updating deceased: ', err);
                });
        }

        function cancel() {
            modalServices.closeModal();
        }

        function clearForm() {
            vm.deceased = {};
            $scope.updateDeceasedForm.$setPristine();
        }

        function initialize() {
            vm.deceased = deceased;

            vm.deceased.date_of_birth_obj = new Date(vm.deceased.date_of_birth);
            vm.deceased.date_of_death_obj = new Date(vm.deceased.date_of_death);

            $scope.$watch(function () {
                return vm.deceased.date_of_birth_obj;
            }, function (newValue) {
                if (!newValue || !newValue instanceof Date) return;
                vm.deceased.date_of_birth = dateUtils.parseDateToISOString(newValue);
            });

            $scope.$watch(function () {
                return vm.deceased.date_of_death_obj;
            }, function (newValue) {
                if (!newValue || !newValue instanceof Date) return;
                vm.deceased.date_of_death = dateUtils.parseDateToISOString(newValue);
            });
        }

        initialize();

    }
}());