(function(){
'use strict';

angular.module('demoApp')
    .factory('blockList', ['gmapServices', blockList]);

    function blockList (gmapServices) {
        var service = {};

        service.polygoncolor = '#e74c3c';
        service.polygonOptions = {
            clickable: true,
            fillColor: service.polygoncolor,
            fillOpacity: 0,
            strokeColor: service.polygoncolor,
            strokeOpacity: 0.9,
            strokeWeight: 2,
            zIndex: 101
        };

        service.blocks = {};

        //service.loadBlocks = loadBlocks;
        service.loadBlocksForSection = loadBlocksForSection;
        service.add = add;

        //function loadBlocks () {
        //    Blocks.getList()
        //        .then(function(response){
        //            response.forEach(function(blk){
        //                service.add(blk);
        //            });
        //        }, function(error){
        //            console.log('Error loading blocks list: ', error);
        //        });
        //}

        function loadBlocksForSection (section) {
            if(!section.blocks) return;

            section.blocks.forEach(function(block){
                service.add(section.id, block);
            });
        }

        function add (sectionId, data) {
            if (!service.blocks[sectionId]) service.blocks[sectionId] = [];

            data.polygon = createPolygon(data);

            service.blocks[sectionId].push(data);
        }

        function createPolygon(block) {
            var polygon = gmapServices.createCustomPolygon(block.area, service.polygonOptions);

            gmapServices.addListener(polygon, 'click', function() {
                //section.get()
                //    .then(function(sectionResponseObject){
                //        console.log('sectionResponseObject: ', sectionResponseObject);
                //        $mdSidenav('sectionDetailsSidenav')
                //            .open()
                //            .then(function () {
                //                $rootScope.$broadcast('show-section-details', {section: sectionResponseObject});
                gmapServices.setZoomIfGreater(21);
                gmapServices.panToPolygon(polygon);
                    //        });
                    //});

            });

            return polygon;
        }

        return service;
    }
}());