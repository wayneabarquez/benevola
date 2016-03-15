(function () {
    'use strict';

    angular.module('demoApp')
        .controller('addLotOccupantController', ['$rootScope', '$scope', '$mdDialog', 'lot', addLotOccupantController]);

    function addLotOccupantController($rootScope, $scope, $mdDialog, lot) {
        var vm = this;

        vm.lot = null;
        vm.occupant = {};

        vm.initialize = initialize;
        vm.save = save;
        vm.cancel = cancel;
        vm.clearForm = clearForm;

        vm.initialize();

        $scope.maxDate = new Date();

        /* Controller Functions here */

        function initialize() {
            vm.lot = lot;
            console.log('lot details: ', vm.lot);
        }

        function save() {
            if($scope.newForm.$valid) {
                vm.lot.post('deceased', vm.occupant)
                    .then(function (response) {
                        console.log('New Deceased: ', response);
                        $mdDialog.hide();
                        // TODO fetch new lot info via http request
                        $rootScope.$broadcast('show-lot-detail', {lot: vm.lot});
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

    }
}());