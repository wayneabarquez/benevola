(function(){
'use strict';

angular.module('demoApp')
    .controller('sectionDetailsController', ['$rootScope', '$mdSidenav', 'sectionList', 'gmapServices', 'drawingServices', 'modalServices', sectionDetailsController]);

    function sectionDetailsController ($rootScope, $mdSidenav, sectionList, gmapServices, drawingServices, modalServices) {
        var vm = this;

        vm.lastPolygon = null;

        vm.editMode = false;
        vm.tempSection = {
            name: null,
            polygon: null,
            area: []
        };

        var saveListener = null;

        vm.section = {
          id: '',
          name: '',
          blocks: [],
          area: []
        };

        vm.initialize = initialize;
        vm.addBlock = addBlock;
        vm.editSection = editSection;
        vm.saveChanges = saveChanges;
        vm.close = close;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $rootScope.$on('show-section-details', function(event, params){
                vm.editMode = false;
                vm.section = params.section;
                //vm.section.blocks = blocks;
                vm.tempSection.name = params.section.name;

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

        function addBlock (ev) {
            $rootScope.$broadcast('start-drawing');
            drawingServices.startDrawingMode('#e74c3c');

            saveListener = $rootScope.$on('save-area', function (event, param) {
                console.log('save area for block', param.area);
                modalServices.showAddBlock(ev, vm.section, param.area)
                    .then(function (result) {
                        sectionList.add(result.section);
                    }, function (reason) {
                        console.log('failed: ', reason);
                    });
            });
        }

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

        function toggle(flag) {
            vm.editMode = flag;
            gmapServices.setEditablePolygon(vm.tempSection.polygon, flag);
        }

        function close () {
            $mdSidenav('sectionDetailsSidenav')
                .close()
                .then(function(){
                    vm.section = {
                        id: '',
                        name: '',
                        area: []
                    };
                });
        }

    }
}());