(function(){
'use strict';

angular.module('demoApp')
    .factory('sectionList', ['$rootScope', 'gmapServices', 'Sections', '$mdSidenav', sectionList]);

    function sectionList ($rootScope, gmapServices, Sections, $mdSidenav) {
        var service = {};

        service.polygoncolor = '#3498db';
        service.polygonOptions = {
            clickable: true,
            fillColor: service.polygoncolor,
            fillOpacity: 0,
            strokeColor: service.polygoncolor,
            strokeOpacity: 0.9,
            strokeWeight: 4,
            zIndex: 100
        };

        service.sections = [];

        service.loadSections = loadSections;
        service.add = add;

        function loadSections () {
            Sections.getList()
                .then(function(response){
                    response.forEach(function(section){
                        service.add(section);
                    });
                }, function(error){
                    console.log('Error loading sections list: ',error);
                });
        }

        function add (sectionData) {
            //var section = {
            //    id: sectionData.id,
            //    name: sectionData.name,
            //    area: sectionData.area
            //};
            //section.polygon = createPolygon(sectionData);
            sectionData.polygon = createPolygon(sectionData);
            service.sections.push(sectionData);
            return sectionData;
        }

        function createPolygon(section) {
            var polygon = gmapServices.createCustomPolygon(section.area, service.polygonOptions);

            gmapServices.addListener(polygon, 'click', function() {
                section.get()
                    .then(function(sectionResponseObject){
                        console.log('sectionResponseObject: ', sectionResponseObject);
                        $mdSidenav('sectionDetailsSidenav')
                            .open()
                            .then(function () {
                                $rootScope.$broadcast('show-section-details', {section: sectionResponseObject});
                                gmapServices.panToPolygon(polygon);
                            });
                    });

            });

            return polygon;
        }

        return service;
    }
}());