(function(){
'use strict';

angular.module('demoApp')
    .controller('adminController', ['$rootScope', '$scope', 'drawingServices', 'modalServices', adminController]);

    function adminController ($rootScope, $scope, drawingServices, modalServices) {
        var vm = this;

        // drawing tools
        vm.drawBtn = {
          save: false,
          delete: false,
          cancel: false
        };

        // save listeners
        var saveListeners = {
            section: null,
            block: null,
            lot: null
        };

        vm.initialize = initialize;

        vm.addSection = addSection;
        vm.addBlock = addBlock;
        vm.addLot = addLot;

        vm.stopDrawing = stopDrawing;
        vm.saveArea = saveArea;
        vm.deleteSelected = deleteSelected;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {

            $rootScope.$on('overlay-complete', function () {
                $scope.$apply(function(){
                    vm.drawBtn.save = true;
                    vm.drawBtn.delete = true;
                });
            });
        }

        function addSection (ev) {
            startDrawing();

            saveListeners.section = $scope.$on('save-area', function(event, param){
               //console.log('save area for section', param.area);
                modalServices.showAddSection(ev, param.area)
                    .then(function(result){
                        console.log('success: ',result);
                    }, function(reason){
                        console.log('failed: ',reason);
                    });
            });
        }

        function addBlock(ev) {
            startDrawing();

            saveListeners.block = $scope.$on('save-area', function (event, param) {
                console.log('save area for block', param.area);
            });
        }

        function addLot(ev) {
            startDrawing();

            saveListeners.lot = $scope.$on('save-area', function (event, param) {
                console.log('save area for lot', param.area);
            });
        }

        function saveArea() {
            if (!drawingServices.overlay) {
                alert('Cannot proceed. No Overlay Drawn.')
                return;
            }

            var area = drawingServices.overlayDataArray;

            $scope.$broadcast('save-area', {area: area});

            //if (vm.areaPolygon) {
            //    if (!vm.areaPolygon.getMap()) {
            //        vm.areaPolygon.setMap(gmapServices.map);
            //    }
            //    gmapServices.updatePolygon(vm.areaPolygon, vm.solar.area);
            //} else {
            //    vm.areaPolygon = gmapServices.createPolygon(vm.solar.area);
            //}

            // send ajax request to server to save section

            vm.stopDrawing();
        }

        function deleteSelected() {
            if (drawingServices.overlay) {
                drawingServices.clearOverlay();
                vm.drawBtn.save = false;
            }
        }

        function stopDrawing () {
            drawingServices.stopDrawingMode();

            // hide draw buttons
            for(var key in vm.drawBtn) vm.drawBtn[key] = false;

            // destroy save listeners
            for (var key in saveListeners) {
                if(saveListeners[key]) {
                    saveListeners[key]();
                    saveListeners[key] = null;
                }
            }
        }

        /* Non Scope Functions here */

        function startDrawing () {
            drawingServices.startDrawingMode();
            // Show Cancel Map button
            vm.drawBtn.cancel = true;
        }

    }
}());