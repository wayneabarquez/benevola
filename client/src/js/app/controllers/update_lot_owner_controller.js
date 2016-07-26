(function () {
    'use strict';

    angular.module('demoApp')
        .controller('updateLotOwnerController', ['$rootScope', '$scope', 'LOT_STATUSES', '$mdDialog', 'lot', 'clients', 'Lots', 'modalServices', 'dateUtils', updateLotOwnerController]);

    function updateLotOwnerController($rootScope, $scope, LOT_STATUSES, $mdDialog, lot, clients, Lots, modalServices, dateUtils) {
        var vm = this;

        vm.lot = null;

        vm.clients = clients;
        vm.selectedClient = {
            client_id: null
        };

        vm.lotParam = {
            status: {
                selected: '',
                showMenu: false,
                data: LOT_STATUSES.splice(0, 2)
            }
        };

        vm.initialize = initialize;
        vm.save = save;
        vm.cancel = cancel;
        vm.clearForm = clearForm;

        /* Controller Functions here */

        function save () {
            if( !$scope.selectClientDateForm.$valid) {
                // Show error messages
            } else {
                console.log('vm.client: ', vm.client);
                if (vm.client && $scope.newClientForm.$valid) {
                    vm.client.lot_id = vm.lot.id;
                    vm.lot.client = vm.client;
                } else {
                    // update lot with this client id
                    vm.lot.client_id = vm.selectedClient.client_id;
                }

                vm.lot.customPUT(null, 'client')
                    .then(function (response) {
                        $mdDialog.hide();
                        if(!vm.lot.c_no)
                            $rootScope.$broadcast('update-lot-detail', {lot: Lots.cast(response.lot)});
                        else
                            modalServices.showColumbaryList();
                    }, function (err) {
                        console.log('Error adding new client: ', err);
                    });
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function clearForm() {
            vm.client = angular.copy(vm.rawClient);
            $scope.newClientForm.$setPristine();
        }

        function initialize() {
            // cleared data
            vm.rawClient = angular.copy(vm.client);

            vm.lot = lot;

            vm.selectedClient.client_id = lot.client_id;
            vm.dateSold = new Date(lot.date_purchased);
            console.log('lot details: ', vm.lot);

            //$scope.$watch(function(){
            //
            //})

            $scope.$watch(function () {
                return vm.dateSold;
            }, function (newValue) {
                if (!newValue || !newValue instanceof Date) return;
                vm.lot.date_purchased = dateUtils.parseDateToISOString(newValue);
            });
        }

        initialize();

    }
}());