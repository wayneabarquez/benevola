(function(){
'use strict';

angular.module('demoApp')
    .controller('lotDetailsController', ['$scope', '$mdDialog', 'lot', 'modalServices', '$q', 'lotHelper', 'Restangular', 'alertServices', 'Deceased', lotDetailsController]);

    function lotDetailsController ($scope, $mdDialog, lot, modalServices, $q, lotHelper, Restangular, alertServices, Deceased) {
        var vm = this;

        $scope.showEditLotNameForm = false;
        $scope.showEditLotORNoForm = false;
        $scope.showEditLotDimensionForm = false;
        $scope.showEditLotPriceForm = false;
        $scope.showEditLotRemarksForm = false;
        $scope.showEditLotAreaForm = false;
        $scope.showEditLotBlockNoForm = false;

        vm.lot = null;
        vm.blocks = [];

        vm.initialize = initialize;
        vm.markSold = markSold;
        vm.addOccupant = addOccupant;

        vm.updateLot = updateLot;

        vm.updateLotORNo = updateLotORNo;
        vm.updateLotDimension = updateLotDimension;
        vm.updateLotPrice = updateLotPrice;
        vm.updateLotRemarks = updateLotRemarks;
        vm.updateLotName = updateLotName;
        vm.updateLotArea = updateLotArea;
        vm.updateLotBlockNo = updateLotBlockNo;

        vm.showUpdateDeceased = showUpdateDeceased;
        vm.deleteDeceased = deleteDeceased;

        vm.cancel = cancel;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            vm.lot = lot;
            console.log('lot details: ', vm.lot);

            //vm.lot_copy = angular.copy(vm.lot);

            //$scope.$watch(function(){
            //    return vm.lot;
            //}, function(newValue){
            //    vm.lot_copy = angular.copy(newValue);
            //});

            $scope.$watch(function () {
                return vm.lot.lot_area;
            }, computeLotAmount);

            $scope.$watch(function () {
                return vm.lot.price_per_sq_mtr;
            }, computeLotAmount);

            $scope.$watch(function () {
                return vm.lot.dimension;
            }, function (newValue, oldValue) {
                if (newValue == oldValue) return;
                computeLotArea(newValue);
            });

            Restangular
                .one('sections', vm.lot.block.section_id)
                .all('blocks')
                .getList()
                .then(function(response){
                   console.log('get all blocks for section '+vm.lot.block.section.name, response);
                    response.forEach(function(block){
                       vm.blocks.push(block);
                    });
                },function(error){
                    console.log('error getting all blocks for section', error);
                });
        }

        function computeLotArea(dimension) {
            var result = lotHelper.computeArea(dimension);

            vm.lot.dimension = result.dimension;
            vm.lot.lot_area = result.area;
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

        function updateLot () {
            var dfd = $q.defer();
            vm.lot.put()
                .then(function (response) {
                    dfd.resolve(response);
                }, function (error) {
                    dfd.reject(error);
                });
            return dfd.promise;
        }

        function updateLotPrice () {
            updateLot()
                .then(function (response) {
                    vm.lot.price_per_sq_mtr = response.lot.price_per_sq_mtr;
                    $scope.showEditLotPriceForm = false;
                });
        }

        function updateLotORNo () {
            updateLot()
                .then(function (response) {
                    vm.lot.or_no = response.lot.or_no;
                    $scope.showEditLotORNoForm = false;
                });
        }

        function updateLotDimension () {
            updateLot()
                .then(function (response) {
                    vm.lot.lot_area = response.lot.lot_area;
                    vm.lot.dimension = response.lot.dimension;
                    $scope.showEditLotDimensionForm = false;
                });
        }

        function updateLotRemarks () {
            updateLot()
                .then(function (response) {
                    vm.lot.remarks = response.lot.remarks;
                    $scope.showEditLotRemarksForm = false;
                });
        }

        function updateLotName () {
            updateLot()
                .then(function(response){
                    vm.lot.name = response.lot.name;
                    $scope.showEditLotNameForm = false;
                });
        }


        function updateLotArea() {
            updateLot()
                .then(function (response) {
                    vm.lot.lot_area = response.lot.lot_area;
                    $scope.showEditLotAreaForm = false;
                });
        }

        function updateLotBlockNo () {
            updateLot()
                .then(function (response) {
                    vm.lot.block_id = response.lot.block_id;
                    vm.lot.block = response.lot.block;
                    $scope.showEditLotBlockNoForm = false;
                });
        }

        function showUpdateDeceased (deceased) {
            // show modal
            modalServices.showUpdateDeceased(Deceased.cast(deceased))
                .then(function (response) {
                });
        }

        function deleteDeceased (deceased) {
            var callback = function (isConfirm) {
              if (isConfirm) {
                  var deceasedRest = Deceased.cast(deceased);
                  deceasedRest.remove()
                      .then(function(response){
                          if (response.status == 200) {
                              var index = _.findIndex(vm.lot.deceased, {id: parseInt(deceased.id)});
                              if(index > -1) {
                                  vm.lot.deceased.splice(index, 1);
                                  alertServices.showMessage('Deceased/Occupant Removed.', 'success');
                              }
                          }
                      });
              } else alertServices.showMessage('Cancelled', 'error');
            };

            alertServices.showPrompt('Deceased/Occupant', callback);
        }

        function cancel () {
            $mdDialog.cancel();
        }

        function computeLotAmount () {
            vm.lot.amount = parseFloat(vm.lot.price_per_sq_mtr) * parseFloat(vm.lot.lot_area);
        }

    }
}());