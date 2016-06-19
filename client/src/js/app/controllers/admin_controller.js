(function(){
'use strict';

angular.module('demoApp')
    .controller('adminController', ['$rootScope', '$scope', 'Sections', 'drawingServices', 'modalServices', 'sectionList', adminController]);

    function adminController ($rootScope, $scope, Sections, drawingServices, modalServices, sectionList) {
        var vm = this;

        // drawing tools
        vm.drawBtn = {
          save: false,
          delete: false,
          cancel: false
        };

        // save listeners
        var saveListeners = {
            section: null
        };

        $rootScope.sections = [];

        vm.initialize = initialize;

        vm.addSection = addSection;

        vm.stopDrawing = stopDrawing;
        vm.saveArea = saveArea;
        vm.deleteSelected = deleteSelected;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            sectionList.loadSections();

            $rootScope.$on('start-drawing', function(){
               vm.drawBtn.cancel = true;
            });

            $rootScope.$on('overlay-complete', function () {
                $scope.$apply(function(){
                    vm.drawBtn.save = true;
                    vm.drawBtn.delete = true;
                });
            });

            $rootScope.$on('duplicate-complete', function () {
                $scope.$apply(function () {
                    vm.drawBtn.cancel = true;
                    vm.drawBtn.save = true;
                });
            });

            $rootScope.$on('end-drawing', function(){
                terminateButtonsAndListeners();
            });
        }

        function addSection (ev) {
            startDrawing();

            saveListeners.section = $scope.$on('save-area', function(event, param){
                modalServices.showAddSection(ev, param.area)
                    .then(function(result){
                        // Restangularized Object
                        Sections.get(result.section.id)
                            .then(function (response) {
                                sectionList.add(response);
                            });
                    }, function(reason){
                        console.log('failed: ',reason);
                    })
                    .finally(function(){
                        saveListeners.section();
                        saveListeners.section = null;
                    });
            });
        }

        function saveArea() {
            if (drawingServices.duplicateLotPolygon) {
                var _path = drawingServices.getPolygonCoords(drawingServices.duplicateLotPolygon);
                $rootScope.$broadcast('save-duplicate', {path: _path});
                vm.stopDrawing();
                return;
            }

            if (drawingServices.updateLotPolygon) {
                var _path = drawingServices.getPolygonCoords(drawingServices.updateLotPolygon);
                $rootScope.$broadcast('save-lot-polygon', {path: _path});
                //vm.stopDrawing();
                return;
            }

            if (!drawingServices.overlay) {
                alert('Cannot proceed. No Overlay Drawn.')
                return;
            }

            var area = drawingServices.overlayDataArray;

            $rootScope.$broadcast('save-area', {area: area});

            vm.stopDrawing();
        }

        function deleteSelected() {
            if (drawingServices.overlay) {
                drawingServices.clearOverlay();
                vm.drawBtn.save = false;
            }
        }

        function terminateButtonsAndListeners () {
            drawingServices.destroyUpdateLotPolygon();
            drawingServices.destroyDuplicateLot();
            drawingServices.stopDrawingMode();

            // hide draw buttons
            for (var key in vm.drawBtn) vm.drawBtn[key] = false;

            // destroy save listeners
            for (var key in saveListeners) {
                if (saveListeners[key]) {
                    saveListeners[key]();
                    saveListeners[key] = null;
                }
            }
        }

        function stopDrawing () {
            $rootScope.$broadcast('stop-drawing');

            terminateButtonsAndListeners();
        }

        /* Non Scope Functions here */

        function startDrawing () {
            drawingServices.startDrawingMode();
            // Show Cancel Map button
            vm.drawBtn.cancel = true;
        }

    }
}());