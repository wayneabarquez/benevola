(function(){
'use strict';

angular.module('demoApp')
    .controller('settingsController', ['$mdDialog', 'Settings', 'alertServices', 'lastLot', settingsController]);

    function settingsController ($mdDialog, Settings, alertServices, lastLot) {
        var vm = this;

        vm.settings = {
            price_per_sq_mtr: ''
        };

        vm.lastLotPrice = {};

        vm.initialize = initialize;
        vm.save = save;
        vm.cancel = cancel;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            vm.lastLotPrice = lastLot;
            console.log('lastLotPrice: ',vm.lastLotPrice);
        }

        function save () {
            Settings.post(vm.settings)
                .then(function (response) {
                    console.log('Success saving settings: ',response);
                    alertServices.settingsSuccessfullySaved();
                    $mdDialog.hide(response);
                }, function (error) {
                    console.log('Error: ', error);
                    // Show Errors
                });
        }

        function cancel () {
            $mdDialog.cancel();
        }

        /* Non Scope Functions here */

    }
}());