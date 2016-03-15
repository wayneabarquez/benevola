(function(){
'use strict';

angular.module('demoApp')
    .controller('sectionDetailsIndexController', ['$rootScope', '$mdSidenav', 'sectionList', 'blockList', 'lotList', 'gmapServices', 'drawingServices', 'modalServices', sectionDetailsIndexController]);

    function sectionDetailsIndexController ($rootScope, $mdSidenav, sectionList, blockList, lotList, gmapServices, drawingServices, modalServices) {
        var vm = this;

        vm.lastPolygon = null;

        vm.editMode = false;
        vm.tempSection = {
            name: null,
            polygon: null,
            area: []
        };

        var saveListener = {
            block: null,
            lot: null
        };

        vm.section = {
          id: '',
          name: '',
          blocks: [],
          area: []
        };

        vm.sectionInfo = {
            lotCount: 0,
            soldLot: 0,
            unsoldLot: 0
        };


        vm.initialize = initialize;
        vm.close = close;

        vm.editSection = editSection;
        vm.saveChanges = saveChanges;

        vm.addBlock = addBlock;
        vm.showBlock = showBlock;

        vm.addLot = addLot;
        vm.onLotClick = onLotClick;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $rootScope.$on('show-section-details', function(event, params){
                vm.editMode = false;
                vm.section = params.section;
                vm.tempSection.name = params.section.name;

                updateSectionDetails(vm.section);

                gmapServices.hidePolygon(vm.section.polygon);

                if(vm.lastPolygon) {
                    gmapServices.setEditablePolygon(vm.lastPolygon, false);
                    gmapServices.showPolygon(vm.lastPolygon)
                }

                vm.lastPolygon = vm.section.polygon;

                if(vm.tempSection.polygon) {
                    gmapServices.hidePolygon(vm.tempSection.polygon);
                    vm.tempSection.polygon = null;
                }

                vm.tempSection.polygon = gmapServices.createCustomPolygon(vm.section.area, sectionList.polygonOptions);
            });
        }

        function updateSectionDetails (section) {
            console.log('section details: ',section);
            section.blocks.forEach(function(blk){
                vm.sectionInfo.lotCount += blk.lots.length;
                vm.sectionInfo.soldLot += _.where(blk.lots, {status: 'sold'}).length;
                vm.sectionInfo.soldLot += _.where(blk.lots, {status: 'occupied'}).length;
                vm.sectionInfo.unsoldLot += _.where(blk.lots, {status: 'vacant'}).length;
            });
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

        function addBlock(ev) {
            $rootScope.$broadcast('start-drawing');
            drawingServices.startDrawingMode('#e74c3c');

            saveListener.block = $rootScope.$on('save-area', function (event, param) {
                modalServices.showAddBlock(ev, vm.section, param.area)
                    .then(function (result) {
                        blockList.add(result.block.section_id, result.block);
                        vm.section.blocks.push(result.block);
                    }, function (reason) {
                        console.log('failed: ', reason);
                    })
                    .finally(function(){
                        // destroy listener
                        saveListener.block();
                        saveListener.block = null;
                    });
            });
        }

        function showBlock(block) {
            gmapServices.setZoomIfGreater(21);
            gmapServices.panToPolygon(block.polygon);
        }

        /* End of Block Functions */

        /* Lot Functions */

        function addLot(ev, block) {
            $rootScope.$broadcast('start-drawing');
            drawingServices.startDrawingMode('#2ecc71');

            console.log('Block: ',block);

            saveListener.lot = $rootScope.$on('save-area', function (event, param) {
                modalServices.showAddLot(ev, block, param.area)
                    .then(function (result) {
                        lotList.add(block.id, result.lot);
                        block.lots.push(result.lot);
                    }, function (reason) {
                        console.log('failed: ', reason);
                    })
                    .finally(function () {
                        // destroy listener
                        saveListener.lot();
                        saveListener.lot = null;
                    });
            });
        }

        function onLotClick (lot) {
            var foundLot = lotList.findLot(lot.block_id, lot.id);
            if (foundLot) gmapServices.triggerEvent(foundLot.polygon, 'click');
        }

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
            $mdSidenav('sectionDetailsIndexSidenav')
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