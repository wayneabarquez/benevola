(function(){
'use strict';

angular.module('demoApp')
    .factory('blockList', ['lotList', 'gmapServices', blockList]);

    function blockList (lotList, gmapServices) {
        var service = {};

        service.polygoncolor = '#ffffff';
        service.polygonOptions = {
            clickable: true,
            fillColor: service.polygoncolor,
            fillOpacity: 0,
            strokeColor: service.polygoncolor,
            strokeOpacity: 0.3,
            strokeWeight: 2,
            zIndex: 100
        };

        service.blocks = {};

        service.loadBlocksForSection = loadBlocksForSection;
        service.add = add;

        function loadBlocksForSection (section, forIndex) {
            if(!section.blocks) return;

            section.blocks.forEach(function(block){
                service.add(section.id, block, forIndex);
            });
        }

        function add (sectionId, data, forIndex) {
            if (!service.blocks[sectionId]) service.blocks[sectionId] = [];

            // #Note: Remove Polygon for blocks
            // instead lower the opacity #done
            data.polygon = createPolygon(data, forIndex);

            lotList.loadLotsForBlock(data, forIndex);

            service.blocks[sectionId].push(data);
        }

        function createPolygon(block, forIndex) {
            var polygon = gmapServices.createCustomPolygon(block.area, service.polygonOptions);

            var adminHandler = function () {
                console.log('admin handler for polygon click block');
            };

            var indexHandler = function () {
                console.log('index handler for polygon click block');
                //$mdSidenav('blockDetailsIndexSidenav')
                //    .open()
                //    .then(function () {
                //        $rootScope.$broadcast('show-block-details', {block: block});
                //    });
            };

            var handler = forIndex ? indexHandler : adminHandler;

            gmapServices.addListener(polygon, 'click', function() {
                gmapServices.setZoomIfGreater(21);
                gmapServices.panToPolygon(polygon);
                //handler();
            });

            return polygon;
        }

        return service;
    }
}());