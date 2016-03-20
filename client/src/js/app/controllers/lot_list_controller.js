(function () {
    'use strict';

    angular.module('demoApp')
        .controller('lotListController', ['$rootScope', '$scope', 'sectionList', 'lotList', 'gmapServices', '$timeout', lotListController]);

    function lotListController($rootScope, $scope, sectionList, lotList, gmapServices, $timeout) {
        var vm = this;

        vm.showList = false;

        // complete list of Solars from the server
        $rootScope.lotList = [];

        vm.query = {
            order: 'status',
            limit: 10,
            page: 1,
            filter: ''
        };

        vm.filter = {
            show: false,
            form: null
        };

        vm.searchFilters = {
            section_id: "",
            block_id: "",
            id: "",
            lot_area: "",
            price_per_sq_mtr: "",
            amount: "",
            status: "",
            client_name: "",
            date_purchased_formatted: ""
        };

        vm.searchInfowindow = gmapServices.createInfoWindow('');

        // Table Header
        vm.tableHeaderList = ['Section No.', 'Block No.', 'Lot No.', 'Dimension', 'Area', 'Amount (Price/SM)', 'Remarks', 'Owner', 'Date Purchased', 'Action'];

        vm.initialize = initialize;
        vm.toggleList = toggleList;
        vm.close = close;
        vm.onClickRow = onClickRow;
        vm.showLotDetails = showLotDetails;
        vm.onReorder = onReorder;
        vm.removeFilter = removeFilter;

        vm.initialize();

        function initialize() {
            sectionList.loadSections(true);

            loadLots();

            $(document).on('click', '.show-lot-detail-button', function () {
                var lotId = $(this).data('lot-id'),
                    blockId = $(this).data('block-id');

                var foundLot = lotList.findLot(blockId, lotId);

                if(foundLot) {
                    vm.searchInfowindow.close();
                    gmapServices.triggerEvent(foundLot.polygon, 'click');
                }
            });

            $scope.$watch(angular.bind(vm, function () {
                return vm.query.filter;
            }), startFilter);
        }

        function toggleList() {
            vm.showList = !vm.showList;
        }

        /* Table Functions */

        function onReorder() {}

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';

            if (vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }
        }

        function onClickRow(lot) {
            var foundLot = lotList.findLot(lot.block_id, lot.id);

            if (foundLot) {
                // hide table list
                vm.showList = false;
                showSearchedLotInfowindow(foundLot);
            }
        }

        function showLotDetails (lot) {
            var foundLot = lotList.findLot(lot.block_id, lot.id);

            if (foundLot) {
                $timeout(function(){
                    vm.searchInfowindow.close();
                }, 300);
                gmapServices.triggerEvent(foundLot.polygon, 'click');
            }
        }

        function showSearchedLotInfowindow(lot) {
            var info = '<b>Section No:</b> '+lot.section_id+' <br>';
                info += '<b>Lot No:</b> '+lot.id+' <br>';
                info += '<b>Area:</b> ' + lot.lot_area + ' <br>';
                info += '<b>Amount:</b> ' + lot.amount + ' <br>';
                info += '<b>Status:</b> <span class="'+lot.status+'">' + lot.status + '</span> <br>';
                info += '<b>Date Purchased:</b> ' + lot.date_purchased_formatted + ' <br>';
                info += '<button data-lot-id="'+lot.id+'" data-block-id="'+lot.block_id+'" class="show-lot-detail-button md-primary md-button md-raised">Show Details</button>';

            var center = gmapServices.getPolygonCenter(lot.polygon);
            gmapServices.showInfoWindow(vm.searchInfowindow);
            gmapServices.panTo(center);

            vm.searchInfowindow.setPosition(center);
            vm.searchInfowindow.setContent(info);
        }

        function loadLots() {
            $rootScope.lotList = lotList.lots;
            filterList();
        }

        function startFilter() {
            vm.query.filter = vm.query.filter.toLowerCase();

            for (var key in vm.searchFilters) {
                if (vm.searchFilters.hasOwnProperty(key)) {
                    vm.searchFilters[key] = vm.query.filter;
                }
            }

            filterList();
        }

        function filterList() {
            if (isEmptyFilter()) {
                $rootScope.lots = lotList.lots;
            } else {
                var filtered = manualFilter(vm.searchFilters);
                $rootScope.lots = filtered;
            }
        }

        function manualFilter (searchFilters) {
            var result = [];
            $rootScope.lotList.forEach(function(lot){
                for (var key in searchFilters) {
                    var lotData = String(lot[key]).toLowerCase();
                    if(lotData.indexOf(vm.query.filter) !== -1) {
                        result.push(lot);
                        return;
                    }
                }
            });
            return result;
        }

        function isEmptyFilter() {
            return vm.query.filter === '';
        }

        function close() {
            $mdDialog.hide();
        }
    }
}());