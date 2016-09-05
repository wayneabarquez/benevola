(function () {
    'use strict';

    angular.module('demoApp')
        .controller('clientSelectionController', ['$rootScope', '$scope', 'LOT_STATUSES', '$mdDialog', 'lot', 'clients', 'Clients', 'Lots', 'modalServices', clientSelectionController]);

    function clientSelectionController($rootScope, $scope, LOT_STATUSES, $mdDialog, lot, clients, Clients, Lots, modalServices) {
        var vm = this;

        vm.lot = null;

        vm.clients = clients;
        vm.client = {};
        vm.selectedClient = null;
        vm.searchText = '';

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

        /* Autocomplete functions */
        vm.querySearch = querySearch;

        vm.initialize();

        /* Controller Functions here */

        function initialize() {
            console.log('lot client select controller initialized');

            // cleared data
            vm.rawClient = angular.copy(vm.client);

            vm.lot = lot;

            $scope.$watch(function(){
                return vm.dateSold;
            }, function(newValue, oldValue){
                if(!newValue || newValue === oldValue) return;

                var year = newValue.getFullYear(),
                    month = newValue.getMonth() + 1,
                    day = newValue.getDate();

                vm.lot.date_purchased = year + '-' + month + '-' + day;
            });
        }

        function save() {
            //console.log('Select Client: ',vm.selectedClient);

            var promise = null;

            if( !$scope.selectClientDateForm.$valid) {
                // Show error messages
            } else {
                if (vm.selectedClient) {
                    // update lot with this client id
                    //vm.lot.client_id = vm.selectedClient.client_id;
                    vm.lot.client_id = vm.selectedClient.id;
                    vm.lot.status = 'sold';
                } else {
                    if ($scope.newClientForm.$valid) {
                        vm.client.lot_id = vm.lot.id;
                        vm.lot.client = vm.client;
                    }
                }

                promise = vm.lot.customPUT(null, 'mark_sold');

                promise.then(function (response) {
                    $mdDialog.hide();
                    // TODO fetch new lot info via http request
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

        function querySearch (searchText) {
            var results = [];

            vm.clients.forEach(function(client){
               if (client.first_name.toLowerCase().indexOf(searchText) !== -1
                  || client.last_name.toLowerCase().indexOf(searchText) !== -1) {
                   results.push(client);
               }
            });

            return results;
        }

    }
}());