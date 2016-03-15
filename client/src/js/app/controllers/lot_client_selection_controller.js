(function () {
    'use strict';

    angular.module('demoApp')
        .controller('clientSelectionController', ['$rootScope', '$scope', 'LOT_STATUSES', '$mdDialog', 'lot', 'clients', 'Clients', 'Lots', clientSelectionController]);

    function clientSelectionController($rootScope, $scope, LOT_STATUSES, $mdDialog, lot, clients, Clients, Lots) {
        var vm = this;

        vm.lot = null;

        vm.clients = clients;
        vm.client = {};
        vm.selectedClient = null;

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

        vm.initialize();

        /* Controller Functions here */

        function initialize() {
            console.log('lot client select controller initialized');

            // cleared data
            vm.rawClient = angular.copy(vm.client);

            vm.lot = lot;

            console.log('lot details: ', vm.lot);
        }

        function save() {
            console.log('Select Client: ',vm.selectedClient);

            var promise = null;

            if(vm.selectedClient) {
                // update lot with this client id
                vm.lot.client_id = vm.selectedClient.client_id;
                promise = vm.lot.put();
            } else {
                if($scope.newClientForm.$valid) {
                    vm.client.lot_id = vm.lot.id;

                    promise = Clients.post(vm.client);
                }
            }

            promise.then(function (response) {
                console.log('Select Client: ', response);
                $mdDialog.hide();
                // TODO fetch new lot info via http request
                $rootScope.$broadcast('show-lot-detail', {lot: Lots.cast(response.lot)});
            }, function (err) {
                console.log('Error adding new client: ', err);
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function clearForm() {
            console.log('clear form');
            vm.client = angular.copy(vm.rawClient);
            $scope.newClientForm.$setPristine();
        }

    }
}());