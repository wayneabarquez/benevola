(function(){
'use strict';

angular.module('demoApp')
    .factory('lotList', ['$rootScope', 'gmapServices', 'LOT_COLORS', 'Lots', 'modalServices', lotList]);

    function lotList ($rootScope, gmapServices, LOT_COLORS, Lots, modalServices) {
        var service = {};

        service.polygonColor = LOT_COLORS;
        service.polygonOptions = {
            clickable: true,
            fillOpacity: 0.8,
            strokeColor: '#000000',
            strokeOpacity: 0.6,
            strokeWeight: 1,
            zIndex: 101
        };

        service.lots = {};

        service.loadLotsForBlock = loadLotsForBlock;
        service.add = add;
        service.findLot = findLot;

        function init() {
            //$rootScope.$on('lot-status-updated', function(event, params) {
            //    var lot = params.lot;
            //    var searchLot = _.where(service.lots[lot.block_id], {id: lot.id});
            //    //searchLot = lot;
            //    console.log('searchlot: ',searchLot);
            //});

            $rootScope.$on('update-lot-detail', function(event, params) {
               var lot = params.lot;

                console.log('Update Lot Detail Event: ', lot);

                var foundLot = service.findLot(lot.block_id, lot.id);
                foundLot.status = lot.status;

                var polygonColor = service.polygonColor[lot.status];
                var polygonOpts = angular.extend({}, service.polygonOptions, {
                    fillColor: polygonColor
                });
                foundLot.polygon.setOptions(polygonOpts);

               //lot.get()
               //    .then(function(response){
               //        modalServices.showLotDetail(response)
               //            .then(function (response) {
               //
               //            }, function (err) {
               //
               //            });
               //    });
            });
        }
        init();

        function loadLotsForBlock (block, forIndex) {
            console.log('load lots for block: ',block);

            if(!block.lots) return;

            block.lots.forEach(function(lot){
                service.add(block.id, lot, forIndex);
            });
        }

        function findLot(blockId, lotId) {
            return _.findWhere(service.lots[blockId], {id: lotId});
        }

        function add (blockId, data, forIndex) {
            if (!service.lots[blockId]) service.lots[blockId] = [];

            data.polygon = createPolygon(data, forIndex);

            service.lots[blockId].push(data);
        }

        function createPolygon(lot, forIndex) {
            var polygonColor = service.polygonColor[lot.status];
            var polygonOpts = angular.extend({}, service.polygonOptions, {
               fillColor: polygonColor
            });
            var polygon = gmapServices.createCustomPolygon(lot.area, polygonOpts);

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