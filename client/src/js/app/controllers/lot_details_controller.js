(function(){
'use strict';

angular.module('demoApp')
    .controller('lotDetailsController', ['$scope', '$mdDialog', 'lot', lotDetailsController]);

    function lotDetailsController ($scope, $mdDialog, lot) {
        var vm = this;

        vm.lot = lot;

        vm.initialize = initialize;
        vm.save = save;
        vm.cancel = cancel;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
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

        function save () {
            console.log('save lot');
            //vm.block.post('lots', vm.lot)
            //    .then(function(response){
            //        $mdDialog.hide(response);
            //        alertServices.showLotAdded();
            //    }, function(error){
            //        console.log('Error: ', error);
            //    });
        }

        function cancel () {
            $mdDialog.cancel();
        }

    }
}());