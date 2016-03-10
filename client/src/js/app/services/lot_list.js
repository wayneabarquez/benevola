(function(){
'use strict';

angular.module('demoApp')
    .factory('lotList', ['gmapServices', 'Lots', 'modalServices', lotList]);

    function lotList (gmapServices, Lots, modalServices) {
        var service = {};

        service.polygoncolor = '#2ecc71';
        service.polygonOptions = {
            clickable: true,
            fillColor: service.polygoncolor,
            fillOpacity: 0,
            strokeColor: service.polygoncolor,
            strokeOpacity: 0.9,
            strokeWeight: 2,
            zIndex: 101
        };

        service.lots = {};

        service.loadLotsForBlock = loadLotsForBlock;
        service.add = add;


        function loadLotsForBlock (block, forIndex) {
            console.log('load lots for block: ',block);

            if(!block.lots) return;

            block.lots.forEach(function(lot){
                service.add(block.id, lot, forIndex);
            });
        }

        function add (blockId, data, forIndex) {
            if (!service.lots[blockId]) service.lots[blockId] = [];

            data.polygon = createPolygon(data, forIndex);

            service.lots[blockId].push(data);
        }

        function createPolygon(lot, forIndex) {
            var polygon = gmapServices.createCustomPolygon(lot.area, service.polygonOptions);


            var restangularizedLot = Lots.cast(lot);

            var adminHandler = function () {
                console.log('admin handler for polygon click lot');
            };

            var indexHandler = function () {
                console.log('index handler for polygon click lot');
                // Show Lot Details
                // and option to change status and select client
                modalServices.showLotDetail(restangularizedLot)
                    .then( function (response) {

                    }, function(err) {

                    });
            };

            var handler = forIndex ? indexHandler : adminHandler;

            gmapServices.addListener(polygon, 'click', function() {
                gmapServices.setZoomIfGreater(21);
                gmapServices.panToPolygon(polygon);
                handler();
            });

            return polygon;
        }

        return service;
    }
}());