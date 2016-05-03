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

            //$scope.$watch(function(){
            //    return vm.lot.dimension_width;
            //}, function(newValue, oldValue){
            //    if (newValue == oldValue) return;
            //    computeLotArea();
            //});

            //$scope.$watch(function () {
            //    return vm.lot.dimension_height;
            //}, function (newValue, oldValue) {
            //    if (newValue == oldValue) return;
            //    computeLotArea();
            //});
        }

        function computeLotArea(dimension) {
            lotHelper.computeArea(dimension);

            //vm.lot.lot_area = parseFloat(vm.lot.dimension_width * vm.lot.dimension_height).toFixed(2);
        }

        //function computeLotArea () {
        //    vm.lot.lot_area = parseFloat(vm.lot.dimension_width * vm.lot.dimension_height).toFixed(2);
        //}

        function save () {
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