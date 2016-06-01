(function () {
    'use strict';

    angular.module('demoApp')
        .controller('lotListController', ['$rootScope', '$scope', 'sectionList', 'lotList', 'gmapServices', '$timeout', 'LOT_STATUSES_JSON', 'modalServices', lotListController]);

    function lotListController($rootScope, $scope, sectionList, lotList, gmapServices, $timeout, LOT_STATUSES_JSON, modalServices) {
        var vm = this;

        vm.showList = false;

        // complete list of Solars from the server
        $rootScope.lotList = [];

        $rootScope.lotsDetail = {
            count: {
                all: 0,
                sold: 0,
                vacant: 0,
                occupied: 0
            }
        };

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
        vm.tableHeaderList = [
            'Section No.',
            'Block No.',
            'Lot No.',
            'Dimension',
            'Area',
            'Amount (Price/SM)',
            'Status',
            'OR #',
            'Owner',
            'Date Purchased',
            'Action'
        ];

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

            $rootScope.$watchCollection('lotList', updateLotsDetail);

            $rootScope.$on('toggle-lot-polygons',function (event, params) {
                var status = params.status,
                    value = params.value
                ;

                lotList.togglePolygonByStatus(status, value);
            });
        }

        function toggleList() {
            vm.showList = !vm.showList;
        }

        function updateLotsDetail (newList) {
            $rootScope.lotsDetail.count.all = newList.length;
            $rootScope.lotsDetail.count.vacant = _.where(newList, {status: LOT_STATUSES_JSON.VACANT}).length;
            $rootScope.lotsDetail.count.sold = _.where(newList, {status: LOT_STATUSES_JSON.SOLD}).length;
            $rootScope.lotsDetail.count.occupied = _.where(newList, {status: LOT_STATUSES_JSON.OCCUPIED}).length;
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
            gmapServices.triggerEvent(lot.polygon, 'click');
        }

        function showLotDetails (lot) {
            var foundLot = lotList.findLot(lot.block_id, lot.id);

            if (foundLot) {
                $timeout(function(){
                    vm.searchInfowindow.close();
                }, 300);
                lotList.showLotDetailsModal(foundLot);
            }
        }

        function loadLots() {
            $rootScope.lotList = lotList.lots;
            filterList();

            console.log('lots: ',$rootScope.lots);
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


        /* Columbary Functions */

        vm.showColumbaryModal = showColumbaryModal;

        function showColumbaryModal (e) {
            modalServices.showColumbaryList(e);
        }

        /* Crematorium functions */

        vm.showCrematorium = showCrematorium;

        function showCrematorium(e) {
            modalServices.showCrematorium(e);
        }
    }
}());