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
        service.showLotDetailsModal = showLotDetailsModal;

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

            $(document).on('click', '.show-lot-detail-button', function () {
                var lotId = $(this).data('lot-id'),
                    blockId = $(this).data('block-id');

                var foundLot = service.findLot(blockId, lotId);

                if (foundLot) {
                    service.showLotDetailsModal(foundLot);
                }
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


            var adminHandler = function (lot) {
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

            polygon.lot = lot;

            var indexHandler = function (lot) {
                showLotInfowindow(lot);
            };

            var handler = forIndex ? indexHandler : adminHandler;

            gmapServices.addListener(polygon, 'click', function() {
                gmapServices.setZoomIfGreater(21);
                gmapServices.panToPolygon(polygon);
                handler(this.lot);
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

        function showLotDetailsModal (lot) {
            modalServices.showLotDetail(lot)
                .then(function (response) {
                }, function (err) {
                });
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

        var lotInfowindow = gmapServices.createInfoWindow('');

        function showLotInfowindow(lot) {
            var info = '<b>Lot No:</b> ' + (lot.name ? lot.name : 'undefined') + ' <br>';
            info += '<b>Section No:</b> ' + lot.section_id + ' <br>';
            info += '<b>Lot No:</b> ' + lot.id + ' <br>';
            info += '<b>Area:</b> ' + lot.lot_area + ' <br>';
            info += '<b>Amount:</b> ' + lot.amount + ' <br>';
            info += '<b>Status:</b> <span class="' + lot.status + '">' + lot.status + '</span> <br>';
            info += '<b>Date Purchased:</b> ' + lot.date_purchased_formatted + ' <br>';
            info += '<button data-lot-id="' + lot.id + '" data-block-id="' + lot.block_id + '" class="show-lot-detail-button md-primary md-button md-raised">Show Details</button>';

            var center = gmapServices.getPolygonCenter(lot.polygon);
            gmapServices.showInfoWindow(lotInfowindow);
            gmapServices.panTo(center);

            lotInfowindow.setPosition(center);
            lotInfowindow.setContent(info);
        }


        return service;
    }
}());