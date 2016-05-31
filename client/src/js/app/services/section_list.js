(function(){
'use strict';

angular.module('demoApp')
    .factory('sectionList', ['$rootScope', '$mdSidenav', 'gmapServices', 'Sections', 'blockList', sectionList]);

    function sectionList ($rootScope, $mdSidenav, gmapServices, Sections, blockList) {
        var service = {};

        service.polygoncolor = '#2c3e50';
        service.polygonOptions = {
            clickable: true,
            fillColor: service.polygoncolor,
            fillOpacity: 0,
            strokeColor: service.polygoncolor,
            strokeOpacity: 0.8,
            strokeWeight: 4,
            zIndex: 99
        };

        service.sections = [];

        service.loadSections = loadSections;
        service.add = add;

        function loadSections (loadForIndex) {
            var forIndex = loadForIndex || false;

            Sections.getList()
                .then(function(response){
                    response.forEach(function(section){
                        service.add(section, forIndex);
                    });
                }, function(error){
                    console.log('Error loading sections list: ',error);
                });
        }

        function add (sectionData, forIndex) {
            sectionData.polygon = createPolygon(sectionData, forIndex);

            blockList.loadBlocksForSection(sectionData, forIndex);

            service.sections.push(sectionData);
            return sectionData;
        }

        function createPolygon(section, forIndex) {
            var polygon = gmapServices.createCustomPolygon(section.area, service.polygonOptions);
                polygon.section = section;

            var adminHandler = function () {
                $mdSidenav('sectionDetailsSidenav')
                    .open()
                    .then(function () {
                        $rootScope.$broadcast('show-section-details', {section: section});
                    });
            };

            var indexHandler = function () {
                console.log('section polygon is clicked handler for index');
                $mdSidenav('sectionDetailsIndexSidenav')
                    .open()
                    .then(function () {
                        $rootScope.$broadcast('show-section-details', {section: section});
                    });
            };

            var handler = forIndex ? indexHandler : adminHandler;

            gmapServices.addListener(
                polygon,
                'click',
                function() {
                    gmapServices.setZoomIfGreater(21);
                    gmapServices.panToPolygon(polygon);
                    handler();
                }
            );

            return polygon;
        }

        return service;
    }
}());