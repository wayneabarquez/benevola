(function(){
'use strict';

angular.module('demoApp')
    .factory('sectionList', ['$rootScope', '$mdSidenav', 'gmapServices', 'Sections', 'blockList', sectionList]);

    function sectionList ($rootScope, $mdSidenav, gmapServices, Sections, blockList) {
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
            sectionData.polygon = createPolygon(sectionData);

            blockList.loadBlocksForSection(sectionData);

            service.sections.push(sectionData);
            return sectionData;
        }

        function createPolygon(section) {
            var polygon = gmapServices.createCustomPolygon(section.area, service.polygonOptions);
                polygon.section = section;

            gmapServices.addListener(polygon, 'click', function() {
                var section = this.section;

                $mdSidenav('sectionDetailsSidenav')
                    .open()
                    .then(function () {
                        $rootScope.$broadcast('show-section-details', {section: section});
                        gmapServices.panToPolygon(polygon);
                    });

            });

            return polygon;
        }

        return service;
    }
}());