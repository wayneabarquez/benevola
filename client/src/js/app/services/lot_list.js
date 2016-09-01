(function(){
'use strict';

angular.module('demoApp')
    .factory('lotList', ['$rootScope', 'gmapServices', 'LOT_COLORS', 'drawingServices', 'modalServices', 'Blocks', 'Lots', 'alertServices', lotList]);

    function lotList ($rootScope, gmapServices, LOT_COLORS, drawingServices, modalServices, Blocks, Lots, alertServices) {
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

            data.date_purchased_formatted = data.date_purchased
                                            ? moment(data.date_purchased).format("MMM DD, YYYY")
                                            : '';

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

            Lots.cast(lot);

            var adminHandler = function (_lot) {
                var content = '<div style="min-height: 45px;">';
                content += '<button data-lot-id="' + _lot.id + '" class="md-raised md-button md-primary md-hue-2 md-icon-button md-ink-ripple" id="admin-duplicate-lot-button" type="button"><i class="material-icons">content_copy</i></button>';
                content += '<button data-lot-id="' + _lot.id + '" class="md-raised md-button md-primary md-icon-button md-ink-ripple" id="admin-update-lot-polygon-button" type="button"><i class="material-icons">format_shapes</i></button>';
                content += '<button data-lot-id="'+_lot.id+'" class="md-raised md-button md-warn md-icon-button md-ink-ripple" id="admin-delete-lot-button" type="button"><i class="material-icons">delete</i></button>';
                content += '</div>';

                var center = gmapServices.getPolygonCenter(lot.polygon);
                gmapServices.showInfoWindow(service.selectedLotInfowindow);
                service.selectedLotInfowindow.setPosition(center);
                service.selectedLotInfowindow.setContent(content);

                $('#admin-delete-lot-button').click(function () {
                    var polygonTemp = _lot.polygon;

                    _lot.polygon = null;

                    _lot.remove()
                        .then(function(s){
                            gmapServices.hidePolygon(polygonTemp);
                            polygonTemp = null;
                        },function(e){
                           _lot.polygon = polygonTemp;
                           alertServices.showErrorMessage('Failed to Delete Lot');
                        })
                        .finally(function(){
                            gmapServices.hideInfoWindow(service.selectedLotInfowindow);
                        });
                });

                 $('#admin-duplicate-lot-button').click(function () {
                     // terminate infowindow
                     service.selectedLotInfowindow.close();

                    drawingServices.duplicateLot(_lot);

                     var duplicateListener = $rootScope.$on('save-duplicate', function (event, params) {
                        modalServices.showAddLot(event, null, params.path)
                            .then(function (result) {
                                //console.log('success: ', result);

                                var block = Blocks.cast(result.lot.block);
                                service.add(block, result.lot);

                                // todo
                                //block.lots.push(result.lot);
                            }, function (reason) {
                                console.log('failed: ', reason);
                            })
                            .finally(function () {
                                // destroy listener
                                duplicateListener();
                                duplicateListener = null;
                            });
                    });
                });

                $('#admin-update-lot-polygon-button').click(function () {
                    // terminate infowindow
                    service.selectedLotInfowindow.close();

                    var oldPath = angular.copy(_lot.polygon.getPath());

                    _lot.polygon.setOptions({
                        draggable: true,
                        editable: true
                    });

                    drawingServices.updateLotPolygon = _lot.polygon;

                    $rootScope.$broadcast('duplicate-complete');

                    var updateListener = $rootScope.$on('save-lot-polygon', function(e, params){
                        var path = params.path;
                        var tempPolygon = _lot.polygon;
                        _lot.polygon = null;
                        _lot.area = path;

                        _lot.put()
                            .then(function(response){
                                //console.log('response: ', response);
                                _lot.polygon = tempPolygon;
                                tempPolygon = null;
                                var opts = angular.merge({
                                    draggable: false,
                                    editable: false,
                                    path: response.lot.area
                                }, service.polygonOptions);
                                _lot.polygon.setOptions(opts);

                                $rootScope.$broadcast('end-drawing');

                            },function(error){
                               console.log('error: ',error);
                            })
                            .finally(function(){
                                updateListener();
                                updateListener = null;
                            });
                    });

                    $rootScope.$on('stop-drawing', function(){
                        var oldOpts = angular.merge({
                            draggable: false,
                            editable: false,
                            path: oldPath
                        }, service.polygonOptions);
                        _lot.polygon.setOptions(oldOpts);
                    });
                });
            };

            polygon.lot = lot;

            var indexHandler = function (_lot) {
                showLotInfowindow(_lot);
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
            var info = '<b>Section:</b> ' + lot.block.section.name + ' <br>';
            info += '<b>Block:</b> ' + lot.block.name + ' <br>';
            info += '<b>Lot:</b> ' + (lot.name ? lot.name : 'undefined') + ' <br>';
            info += '<b>Area:</b> ' + lot.lot_area + ' <br>';
            info += '<b>Amount:</b> ' + lot.amount + ' <br>';
            info += '<b>Status:</b> <span class="' + lot.status + '">' + lot.status.toUpperCase() + '</span> <br>';

            if(lot.status != 'vacant') {
                info += '<b>Date Purchased:</b> ' + lot.date_purchased_formatted + ' <br>';
            }

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