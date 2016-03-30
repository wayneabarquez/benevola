(function(){
'use strict';

angular.module('demoApp')
    .controller('lotDetailsController', ['$scope', '$mdDialog', 'lot', 'modalServices', 'Lots', lotDetailsController]);

    function lotDetailsController ($scope, $mdDialog, lot, modalServices, Lots) {
        var vm = this;


        $scope.showEditLotDimensionForm = false;
        $scope.showEditLotPriceForm = false;

        vm.lot = null;

        vm.lot_copy = null;

        vm.initialize = initialize;
        vm.markSold = markSold;
        vm.addOccupant = addOccupant;
        vm.updateLotDimension = updateLotDimension;
        vm.updateLotPrice = updateLotPrice;
        vm.cancel = cancel;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            vm.lot = lot;
            vm.lot_copy = angular.copy(vm.lot);
            console.log('lot details: ', vm.lot);

            //$scope.$watch(function () {
            //    return vm.lot.dimension_height;
            //}, function (newValue, oldValue) {
            //    if (newValue == oldValue) return;
            //    computeLotArea();
            //});
            $scope.$watch(function(){
                return vm.lot;
            }, function(newValue){
                vm.lot_copy = angular.copy(newValue);
            });

            $scope.$watch(function () {
                return vm.lot.lot_area;
            }, computeLotAmount);

            $scope.$watch(function () {
                return vm.lot.price_per_sq_mtr;
            }, computeLotAmount);
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

        function updateLotPrice () {
            var newPrice = {price_per_sq_mtr: vm.lot_copy.price_per_sq_mtr};

            console.log('update price request');
            vm.lot.updatePrice(newPrice)
                .then(function (response) {
                    //console.log('success: ',response);

                    var lot = response.lot;
                    vm.lot.price_per_sq_mtr = lot.price_per_sq_mtr;

                    $scope.showEditLotPriceForm = false;

                }, function (error) {
                    console.log('error: ', error);
                });
        }

        function updateLotDimension () {
            var dimension = {
                dimension_width: vm.lot_copy.dimension_width,
                dimension_height: vm.lot_copy.dimension_height
            };

            //console.log('update dimension request');
            vm.lot.updateDimension(dimension)
                .then(function(response){
                    //console.log('success: ',response);

                    var lot = response.lot;
                    vm.lot.lot_area = lot.lot_area;
                    vm.lot.dimension_width = lot.dimension_width;
                    vm.lot.dimension_height = lot.dimension_height;

                    $scope.showEditLotDimensionForm = false;

                }, function(error){
                    console.log('error: ',error);
                });
        }

        function cancel () {
            $mdDialog.cancel();
        }

        function computeLotAmount () {
            vm.lot.amount = parseFloat(vm.lot.price_per_sq_mtr) * parseFloat(vm.lot.lot_area);
        }

    }
}());