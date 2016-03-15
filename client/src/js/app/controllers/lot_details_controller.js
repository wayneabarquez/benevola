(function(){
'use strict';

angular.module('demoApp')
    .controller('lotDetailsController', ['$scope', '$mdDialog', 'lot', 'modalServices', lotDetailsController]);

    function lotDetailsController ($scope, $mdDialog, lot, modalServices) {
        var vm = this;

        vm.lot = null;

        vm.initialize = initialize;
        vm.markSold = markSold;
        vm.addOccupant = addOccupant;
        vm.cancel = cancel;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            vm.lot = lot;
            console.log('lot details: ', vm.lot);

            //$scope.$watch(function () {
            //    return vm.lot.dimension_height;
            //}, function (newValue, oldValue) {
            //    if (newValue == oldValue) return;
            //    computeLotArea();
            //});
        }

        function markSold () {
            // TODO show modal to select or add new client and a datepicker to select date sold
            // add functionality to update database
            console.log('mark sold lot');

            modalServices.showClientSelection(vm.lot)
                .then(function(success){
                    console.log('ShowClientSelection: ',success);
                    vm.lot.status = 'sold';
                },function(err){
                    console.log('ShowClientSelection: ', err);
                });
        }

        function addOccupant () {
            console.log('add occupant');
            // add functionality to update database
            modalServices.showAddOccupant(vm.lot)
                .then(function (success) {
                    console.log('Show Add Occupant: ', success);
                }, function (err) {
                    console.log('Show Add Occupant: ', err);
                });
        }

        vm.updateLotPricePerSqMtr = updateLotPricePerSqMtr;
        function updateLotPricePerSqMtr (newPrice) {
            console.log('new Price: ',newPrice);
        }

        function cancel () {
            $mdDialog.cancel();
        }

    }
}());