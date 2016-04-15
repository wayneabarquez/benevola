(function(){
'use strict';

angular.module('demoApp')
    .factory('lotList', ['$rootScope', 'gmapServices', 'LOT_COLORS', 'Lots', 'modalServices', lotList]);

    function lotList ($rootScope, gmapServices, LOT_COLORS, Lots, modalServices) {
        var service = {};

        service.selectedLotInfowindow = gmapServices.createInfoWindow('');

        service.polygonColor = LOT_COLORS;
        service.polygonOptions = {
            clickable: true,
            fillOpacity: 0.8,
            strokeColor: '#000000',
            strokeOpacity: 0.6,
            strokeWeight: 1,
            zIndex: 101
        };

        service.lots = [];

        service.loadLotsForBlock = loadLotsForBlock;
        service.add = add;
        service.findLot = findLot;
        service.togglePolygonByStatus = togglePolygonByStatus;

        function initialize() {

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
            });

            $('body').on('click', '.admin-delete-lot-button', function () {
                var lotId = $(this).data('lot-id');
                console.log('delete lot with id = ', lotId);
            });


        }

        initialize();

        function loadLotsForBlock (block, forIndex) {
            if(!block.lots) return;

            block.lots.forEach(function(lot){
                service.add(block, lot, forIndex);
            });
        }

        function findLot(blockId, lotId) {
            return _.findWhere(service.lots, {id: lotId, block_id: blockId});
        }

        function add (block, data, forIndex) {
            //if (!service.lots[blockId]) service.lots[blockId] = [];

            //var blockId = block.id;
            data.section_id = block.section_id;
            data.amount = data.lot_area * data.price_per_sq_mtr;
            data.client_name = data.client && data.client.last_name
                               ? (data.client.first_name + ' ' + data.client.last_name)
                               : '';
            data.date_purchased_formatted = moment(data.date_purchased).format("MMM DD, YYYY");

            data.polygon = createPolygon(data, forIndex);

            //service.lots[blockId].push(data);
            service.lots.push(data);
        }

        function createPolygon(lot, forIndex) {
            var polygonColor = service.polygonColor[lot.status];
            var polygonOpts = angular.extend({}, service.polygonOptions, {
               fillColor: polygonColor
            });
            var polygon = gmapServices.createCustomPolygon(lot.area, polygonOpts);

            var restangularizedLot = Lots.cast(lot);


            var adminHandler = function () {
                //console.log('admin handler for polygon click lot');
                //console.log('lot: ', lot);

                var content = '<button data-lot-id="'+lot.id+'" class="md-raised md-button md-ink-ripple" id="admin-delete-lot-button" type="button">Delete Lot</button>';

                var center = gmapServices.getPolygonCenter(lot.polygon);
                gmapServices.showInfoWindow(service.selectedLotInfowindow);
                service.selectedLotInfowindow.setPosition(center);
                service.selectedLotInfowindow.setContent(content);

                $('#admin-delete-lot-button').click(function () {
                    var lotId = $(this).data('lot-id');
                    //console.log('delete lot with id = ', lotId);

                    var polygonTemp = lot.polygon;

                    lot.polygon = null;

                    lot.remove()
                        .then(function(s){
                            gmapServices.hidePolygon(polygonTemp);
                            polygonTemp = null;
                            //console.log('success deleting lot: ', s);
                        },function(e){
                           //console.log('failed to delete lot: ',e);
                           lot.polygon = polygonTemp;
                           alert('Failed to Delete Lot');
                        })
                        .finally(function(){
                            gmapServices.hideInfoWindow(service.selectedLotInfowindow);
                        });
                });
            };

            var indexHandler = function () {
                //console.log('index handler for polygon click lot');
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

        function togglePolygon(value, polygon) {
            if (value) {
                gmapServices.showPolygon(polygon);
            } else {
                gmapServices.hidePolygon(polygon);
            }
        }

        function togglePolygonByStatus(_status, _value) {
            if(_status === 'all') {
                service.lots.forEach(function (lot) {
                    togglePolygon(_value, lot.polygon);
                });
                return;
            }

            var lots = _.where(service.lots, {status: _status});

            lots.forEach(function(lot){
                togglePolygon(_value, lot.polygon);
            });
        }


        return service;
    }
}());