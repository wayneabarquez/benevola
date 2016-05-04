(function(){
'use strict';

angular.module('demoApp')
    .controller('addLotController', ['$scope', '$mdDialog', 'block', 'area', 'Blocks', 'alertServices', 'lotHelper', addLotController]);

    function addLotController ($scope, $mdDialog, block, area, Blocks, alertServices, lotHelper) {
        var vm = this;

        vm.block = null;

        vm.lot = {
            block_id: block.id,
            area: area,
            dimension_width: 0,
            dimension_height: 0,
            lot_area: ''
        };

        vm.initialize = initialize;
        vm.save = save;
        vm.cancel = cancel;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            // Restangularized
            vm.block = Blocks.cast(block);

            $scope.$watch(function () {
                return vm.lot.dimension;
            }, function (newValue, oldValue) {
                if (newValue == oldValue) return;
                computeLotArea(newValue);
            });
        }

        function computeLotArea(dimension) {
           var result = lotHelper.computeArea(dimension);

            vm.lot.dimension = result.dimension;
            vm.lot.lot_area = result.area;
        }

        function save () {
            vm.lot.dimension = lotHelper.filterDimensionString(vm.lot.dimension);
            vm.block.post('lots', vm.lot)
                .then(function(response){
                    $mdDialog.hide(response);
                    alertServices.showLotAdded();
                }, function(error){
                    console.log('Error: ', error);
                    alertServices.showErrorMessage(error.data.message);
                });
        }

        function cancel () {
            $mdDialog.cancel();
        }

    }
}());