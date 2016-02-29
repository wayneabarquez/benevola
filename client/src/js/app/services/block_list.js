(function(){
'use strict';

angular.module('demoApp')
    .factory('blockList', ['$rootScope', 'gmapServices', 'Blocks', '$mdSidenav', blockList]);

    function blockList ($rootScope, gmapServices, Blocks, $mdSidenav) {
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

        service.blocks = [];

        service.loadBlocks = loadBlocks;
        service.add = add;

        function loadBlocks () {
            Blocks.getList()
                .then(function(response){
                    response.forEach(function(blk){
                        service.add(blk);
                    });
                }, function(error){
                    console.log('Error loading blocks list: ', error);
                });
        }

        function add (data) {
            data.polygon = createPolygon(data);
            service.blocks.push(data);
            return data;
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
                                gmapServices.panToPolygon(polygon);
                    //        });
                    //});

            });

            return polygon;
        }

        return service;
    }
}());