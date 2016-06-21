(function(){
'use strict';

angular.module('demoApp')
    .controller('addLotController', ['$scope', '$mdDialog', 'block', 'area', 'Blocks', 'alertServices', 'lotHelper', 'sections', 'Sections', addLotController]);

    function addLotController ($scope, $mdDialog, block, area, Blocks, alertServices, lotHelper, sections, Sections) {
        var vm = this;

        vm.block = null;

        vm.lot = {
            //block_id: block.id,
            area: area,
            dimension_width: 0,
            dimension_height: 0,
            lot_area: ''
        };

        vm.sections = sections;
        vm.sectionBlocks = [];

        vm.selectedSectionId = null;
        vm.selectedBlockId = null;

        vm.initialize = initialize;
        vm.save = save;
        vm.cancel = cancel;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            // Restangularized
            if(block) {
                vm.lot.block_id = block.id;
                vm.block = Blocks.cast(block);
            }

            $scope.$watch(function () {
                return vm.lot.dimension;
            }, function (newValue, oldValue) {
                if (newValue == oldValue) return;
                computeLotArea(newValue);
            });

            $scope.$watch(function(){
                return vm.selectedSectionId;
            }, function(newValue, oldValue){
                if(!newValue || newValue === oldValue) return;
                var foundSection = _.findWhere(vm.sections, {id: parseInt(newValue)});
                if(foundSection) vm.sectionBlocks = foundSection.blocks;
            });

            $scope.$watch(function () {
                return vm.selectedBlockId;
            }, function (newValue, oldValue) {
                if (!newValue || newValue === oldValue) return;
                var foundSection = _.findWhere(vm.sections, {id: parseInt(vm.selectedSectionId)});
                if (foundSection) {
                    var foundBlock = _.findWhere(foundSection.blocks, {id: parseInt(newValue)});
                    if(foundBlock) {
                        vm.lot.block_id = foundBlock.id;
                        vm.block = Blocks.cast(foundBlock);
                    }
                }
            });
        }

        function computeLotArea(dimension) {
           var result = lotHelper.computeArea(dimension);

            vm.lot.dimension = result.dimension;
            vm.lot.lot_area = result.area;
        }

        function save () {
            vm.lot.dimension = lotHelper.filterDimensionString(vm.lot.dimension);

            if(vm.block) {
                vm.block.post('lots', vm.lot)
                    .then(function (response) {
                        $mdDialog.hide(response);
                        alertServices.showLotAdded();
                    }, function (error) {
                        console.log('Error: ', error);
                        alertServices.showErrorMessage(error.data.message);
                    });
            } else {
                alertServices.showErrorMessage('Please Select Block');
            }
        }

        function cancel () {
            $mdDialog.cancel();
        }

    }
}());