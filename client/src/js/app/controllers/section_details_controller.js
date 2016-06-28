(function(){
'use strict';

angular.module('demoApp')
    .controller('sectionDetailsController', ['$rootScope', '$mdSidenav', 'sectionList', 'blockList', 'lotList', 'gmapServices', 'drawingServices', 'modalServices', sectionDetailsController]);

    function sectionDetailsController ($rootScope, $mdSidenav, sectionList, blockList, lotList, gmapServices, drawingServices, modalServices) {
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


        vm.initialize = initialize;
        vm.close = close;

        vm.editSection = editSection;
        vm.saveChanges = saveChanges;

        vm.addBlock = addBlock;
        vm.showBlock = showBlock;

        vm.addLot = addLot;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $rootScope.$on('show-section-details', function(event, params){
                console.log('show-section-details');

                vm.editMode = false;
                vm.section = params.section;
                vm.tempSection.name = params.section.name;

                var tempSectionPolygon = angular.copy(vm.section.polygon);

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

                vm.tempSection.polygon = tempSectionPolygon;
                console.log('vm.tempSection.polygon: ', vm.tempSection.polygon);
                //vm.tempSection.polygon = gmapServices.createCustomPolygon(vm.section.area, sectionList.polygonOptions);
            });
        }

        /* Section Functions */

        function editSection () {
            toggle(true);
        }

        function saveChanges () {
            toggle(false);
            vm.tempSection.area = drawingServices.getPolygonCoords(vm.section.polygon);
            //vm.tempSection.area = drawingServices.getPolygonCoords(vm.tempSection.polygon);


            console.log('vm.section: ', vm.section);
            // to avoid this error "TypeError: Converting circular structure to JSON"
            vm.section.polygon = null;
            var tempBlocks = vm.section.blocks;
            vm.section.blocks = [];

            vm.section.area = vm.tempSection.area;
            vm.section.name = vm.tempSection.name;

            vm.section.put()
                .then(function(response){
                    //gmapServices.hidePolygon(vm.tempSection.polygon);
                    //vm.tempSection.polygon = null;
                    //vm.lastPolygon = null;
                    gmapServices.hidePolygon(vm.section.polygon);
                    vm.section.polygon = null;
                    vm.lastPolygon = null;

                    vm.section.polygon = gmapServices.createCustomPolygon(vm.section.area, sectionList.polygonOptions);
                }, function(error){
                    console.log('failed updating section: ',error);
                    vm.section.polygon = vm.tempSection.polygon;
                })
                .finally(function(){
                    vm.section.blocks = tempBlocks;
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
            gmapServices.highlightPolygon(block.polygon);
        }

        /* End of Block Functions */

        /* Lot Functions */

        function addLot(ev, block) {
            $rootScope.$broadcast('start-drawing');
            drawingServices.startDrawingMode('#2ecc71');

            saveListener.lot = $rootScope.$on('save-area', function (event, param) {
                modalServices.showAddLot(ev, block, param.area)
                    .then(function (result) {
                        lotList.add(block, result.lot);
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

        /* End of Lot Functions */


        function toggle(flag) {
            vm.editMode = flag;
            gmapServices.setEditablePolygon(vm.section.polygon, flag);
            //gmapServices.setEditablePolygon(vm.tempSection.polygon, flag);
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