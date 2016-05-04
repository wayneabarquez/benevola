(function(){
'use strict';

angular.module('demoApp')
    .controller('lotDetailsController', ['$scope', '$mdDialog', 'lot', 'modalServices', 'Lots', 'lotHelper', lotDetailsController]);

    function lotDetailsController ($scope, $mdDialog, lot, modalServices, Lots, lotHelper) {
        var vm = this;

        $scope.showEditLotNameForm = false;
        $scope.showEditLotORNoForm = false;
        $scope.showEditLotDimensionForm = false;
        $scope.showEditLotPriceForm = false;
        $scope.showEditLotRemarksForm = false;

        vm.lot = null;

        vm.lot_copy = null;

        vm.initialize = initialize;
        vm.markSold = markSold;
        vm.addOccupant = addOccupant;
        vm.updateLotORNo = updateLotORNo;
        vm.updateLotDimension = updateLotDimension;
        vm.updateLotPrice = updateLotPrice;
        vm.updateLotRemarks = updateLotRemarks;
        vm.updateLotName = updateLotName;
        vm.cancel = cancel;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            vm.lot = lot;
            vm.lot_copy = angular.copy(vm.lot);
            console.log('lot details: ', vm.lot_copy);

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

            $scope.$watch(function () {
                return vm.lot_copy.dimension;
            }, function (newValue, oldValue) {
                if (newValue == oldValue) return;
                computeLotArea(newValue);
            });

        }

        function computeLotArea(dimension) {
            var result = lotHelper.computeArea(dimension);

            vm.lot_copy.dimension = result.dimension;
            vm.lot_copy.lot_area = result.area;
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

        function updateLotORNo () {
            console.log('update or no');

            var newORNo = {or_no: vm.lot_copy.or_no};

            vm.lot.updateORNo(newORNo)
                .then(function (response) {
                    //console.log('success: ',response);

                    var lot = response.lot;
                    vm.lot.or_no = lot.or_no;

                    $scope.showEditLotORNoForm = false;

                }, function (error) {
                    console.log('error: ', error);
                });
        }

        function updateLotDimension () {
            var data = {
                dimension: lotHelper.filterDimensionString(vm.lot_copy.dimension),
                lot_area: vm.lot_copy.lot_area
            };

            vm.lot.updateDimension(data)
                .then(function(response){
                    var lot = response.lot;
                    vm.lot.lot_area = lot.lot_area;
                    vm.lot.dimension = lot.dimension;

                    $scope.showEditLotDimensionForm = false;

                }, function(error){
                    console.log('error: ',error);
                });
        }

        function updateLotRemarks () {
            console.log('update lot remarks');

            var data = {remarks: vm.lot_copy.remarks};

            vm.lot.updateRemarks(data)
                .then(function (response) {
                    //console.log('success: ',response);

                    var lot = response.lot;
                    vm.lot.remarks = lot.remarks;

                    $scope.showEditLotRemarksForm = false;

                }, function (error) {
                    console.log('error: ', error);
                });
        }

        function updateLotName () {
            console.log('update lot name');

            var data = {name: vm.lot_copy.name};

            vm.lot.updateName(data)
                .then(function (response) {
                    console.log('success: ',response);
                    var lot = response.lot;
                    vm.lot.name = lot.name;

                    $scope.showEditLotNameForm = false;
                }, function (error) {
                    console.log('error: ', error);
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