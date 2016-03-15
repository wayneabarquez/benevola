(function(){
'use strict';

angular.module('demoApp')
    .controller('blockDetailsIndexController', ['$rootScope', '$mdSidenav', 'sectionList', 'blockList', 'lotList', 'gmapServices', 'drawingServices', 'modalServices', blockDetailsIndexController]);

    function blockDetailsIndexController ($rootScope, $mdSidenav, sectionList, blockList, lotList, gmapServices, drawingServices, modalServices) {
        var vm = this;

        vm.lastPolygon = null;

        vm.editMode = false;
        vm.tempBlock = {
            name: null,
            polygon: null,
            area: []
        };

        var saveListener = {
            lot: null
        };

        vm.block = {
          id: '',
          name: '',
          lots: [],
          area: []
        };

        vm.blockInfo = {
            lotCount: 0,
            soldLot: 0,
            unsoldLot: 0
        };


        vm.initialize = initialize;
        vm.close = close;
        vm.showBlock = showBlock;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $rootScope.$on('show-block-details', function(event, params){
                console.log('show block details event ', params.block);
                vm.editMode = false;
                vm.block = params.block;
                vm.tempBlock.name = params.block.name;

                updateBlockDetails(vm.block);

                gmapServices.hidePolygon(vm.block.polygon);

                if(vm.lastPolygon) {
                    gmapServices.setEditablePolygon(vm.lastPolygon, false);
                    gmapServices.showPolygon(vm.lastPolygon)
                }

                vm.lastPolygon = vm.block.polygon;

                if(vm.tempBlock.polygon) {
                    gmapServices.hidePolygon(vm.tempBlock.polygon);
                    vm.tempBlock.polygon = null;
                }

                vm.tempBlock.polygon = gmapServices.createCustomPolygon(vm.block.area, blockList.polygonOptions);
            });
        }

        function updateBlockDetails (blk) {
            vm.blockInfo.lotCount += blk.lots.length;
            vm.blockInfo.soldLot += _.where(blk.lots, {status: 'sold'}).length;
            vm.blockInfo.soldLot += _.where(blk.lots, {status: 'occupied'}).length;
            vm.blockInfo.unsoldLot += _.where(blk.lots, {status: 'vacant'}).length;
        }

        /* Section Functions */

        function editSection () {
            toggle(true);
        }

        function saveChanges () {
            toggle(false);
            vm.tempSection.area = drawingServices.getPolygonCoords(vm.tempSection.polygon);

            // to avoid this error "TypeError: Converting circular structure to JSON"
            vm.section.polygon = null;

            vm.section.area = vm.tempSection.area;
            vm.section.name = vm.tempSection.name;

            vm.section.put()
                .then(function(response){
                    gmapServices.hidePolygon(vm.tempSection.polygon);
                    vm.tempSection.polygon = null;
                    vm.lastPolygon = null;

                    vm.section.polygon = gmapServices.createCustomPolygon(vm.section.area, sectionList.polygonOptions);

                }, function(error){
                    console.log('failed updating section: ',error);
                });
        }

        /* End Section Functions */


        /* Block Functions */

        function showBlock(block) {
            gmapServices.setZoomIfGreater(21);
            gmapServices.panToPolygon(block.polygon);
        }

        /* End of Block Functions */

        /* Lot Functions */

        /* End of Lot Functions */


        function toggle(flag) {
            vm.editMode = flag;
            gmapServices.setEditablePolygon(vm.tempSection.polygon, flag);
        }

        vm.openBlockMenu = openBlockMenu;
        var originatorEv;

        function openBlockMenu($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        function close () {
            $mdSidenav('sectionDetailsSidenav')
                .close()
                //.then(function(){
                //    vm.section = {
                //        id: '',
                //        name: '',
                //        area: []
                //    };
                //})
            ;
        }

    }
}());