(function () {
    'use strict';

    angular.module('demoApp')
        .controller('lotListController', ['$rootScope', '$scope', 'sectionList', 'lotList', 'gmapServices', '$timeout', 'LOT_STATUSES_JSON', 'modalServices', lotListController]);

    function lotListController($rootScope, $scope, sectionList, lotList, gmapServices, $timeout, LOT_STATUSES_JSON, modalServices) {
        var vm = this;

        vm.showList = false;

        $rootScope.showNewCremationFormPanel = false;

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
            order: '',
            limit: 10,
            page: 1,
            filter: ''
        };

        vm.filter = {
            show: false,
            form: null,
            column: {
                section: '',
                block: '',
                lot: ''
            }
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
            'Section',
            'Block',
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
                    gmapServices.hideInfoWindow(vm.searchInfowindow);
                    gmapServices.triggerEvent(foundLot.polygon, 'click');
                }
            });

            $scope.$watch(angular.bind(vm, function () {
                return vm.query.filter;
            }), function(newValue){
                startFilter(newValue, vm.searchFilters);
            });

            $scope.$watch(function(){
                return vm.filter.column.section;
            }, function (newValue) {
                filterBySection(newValue);
            });

            $scope.$watch(function () {
                return vm.filter.column.block;
            }, function (newValue) {
                filterByBlock(newValue);
            });

            $scope.$watch(function () {
                return vm.filter.column.lot;
            }, function (newValue) {
                filterByLot(newValue);
            });

            $rootScope.$watchCollection('lotList', updateLotsDetail);

            $rootScope.$on('toggle-lot-polygons',function (event, params) {
                var status = params.status,
                    value = params.value
                ;

                lotList.togglePolygonByStatus(status, value);
            });


            $rootScope.$on('update-lot-status', function (event, params) {
                var lot = params.lot;
                var index = _.findIndex($rootScope.lotList, {id: parseInt(lot.id)});
                if(index > -1) $rootScope.lotList[index] = angular.copy(lot);
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

        vm.orderLot = function (lot) {
            var lotChars = lot.name.match(/[a-zA-Z]/);
            return lotChars
                ? lotChars.valueOf()
                : parseInt(lot.name.match(/\d+/)[0]);
        };

        vm.sortBlock = function (lot) {
            return parseInt(lot.block.name.match(/\d+/)[0]);
        };

        vm.sortSection = function (lot) {
            return parseInt(lot.block.section.name.match(/\d+/)[0]);
        };

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
            filterList('');
        }

        function filterBySection (keyword) {
            keyword = keyword.trim().toLowerCase();

            if (keyword === '') {
                $rootScope.lots = lotList.lots;
            } else {
                var result = [];
                $rootScope.lotList.forEach(function (lot) {
                    if (lot.block.section.name.toLowerCase().indexOf(keyword) !== -1) {
                        result.push(lot);
                        return;
                    }
                });
                $rootScope.lots = result;
            }
        }

        function filterByBlock(keyword) {
            keyword = keyword.trim().toLowerCase();

            if (keyword === '') {
                $rootScope.lots = lotList.lots;
            } else {
                var result = [];
                $rootScope.lotList.forEach(function (lot) {
                    if (lot.block.name.toLowerCase().indexOf(keyword) !== -1) {
                        result.push(lot);
                        return;
                    }
                });
                $rootScope.lots = result;
            }
        }

        function filterByLot(keyword) {
            keyword = keyword.trim().toLowerCase();

            if (keyword === '') {
                $rootScope.lots = lotList.lots;
            } else {
                var result = [];
                $rootScope.lotList.forEach(function (lot) {
                    if (lot.name.toLowerCase().indexOf(keyword) !== -1) {
                        result.push(lot);
                        return;
                    }
                });
                $rootScope.lots = result;
            }
        }

        function startFilter(keyword, searchFilters) {
            keyword = keyword.toLowerCase();

            for (var key in searchFilters) {
                if (searchFilters.hasOwnProperty(key)) {
                    searchFilters[key] = keyword;
                }
            }

            filterList(keyword, searchFilters);
        }

        function filterList(keyword, searchFilters) {
            if (keyword === '') {
                $rootScope.lots = lotList.lots;
            } else {
                $rootScope.lots = manualFilter(keyword, searchFilters);
            }
        }

        function manualFilter (keyword, searchFilters) {
            var result = [];

            $rootScope.lotList.forEach(function(lot){
                for (var key in searchFilters) {
                    var lotData = String(lot[key]).toLowerCase();
                    if(lotData.indexOf(keyword) !== -1) {
                        result.push(lot);
                        return;
                    }
                }
            });

            return result;
        }

        vm.sortList = sortList;

        function sortList (lot) {

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


    angular.module('demoApp')
        .filter('stripLotLabel', function () {
            return function (input, column) {
                return input.trim().toUpperCase().replace(column.toUpperCase(), '');
            }
        });

}());