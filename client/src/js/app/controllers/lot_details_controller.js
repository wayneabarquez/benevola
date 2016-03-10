(function(){
'use strict';

angular.module('demoApp')
    .controller('lotDetailsController', ['$scope', 'LOT_STATUSES', '$mdDialog', 'lot', lotDetailsController]);

    function lotDetailsController ($scope, LOT_STATUSES, $mdDialog, lot) {
        var vm = this;

        vm.lot = null;

        vm.lotParam = {
            status: {
                selected: '',
                showMenu: false,
                data: LOT_STATUSES.splice(0, 2)
            }
        };

        vm.initialize = initialize;
        vm.markSold = markSold;
        vm.addOccupant = addOccupant;
        vm.cancel = cancel;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            console.log('lot details controller initialized');

            vm.lot = lot;

            console.log('lot details: ', vm.lot);

            // Restangularized
            //vm.block = Blocks.cast(block);

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
            vm.lot.status = 'sold';
        }

        function addOccupant () {
            console.log('add occupant');
            // TODO show mddialog hacky style in solar
            // add functionality to update database
        }

               function cancel () {
            $mdDialog.cancel();
        }

    }
}());