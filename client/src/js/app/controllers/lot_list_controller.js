(function () {
    'use strict';

    angular.module('demoApp')
        .controller('lotListController', ['$rootScope', '$filter', 'Lots', 'lotList', 'gmapServices', lotListController]);

    function lotListController($rootScope, $filter, Lots, lotList, gmapServices) {
        var vm = this;

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
            '$': ''
        };

        // Table Header
        vm.tableHeaderList = ['Lot No.', 'Dimension', 'Area', 'Price/SM', 'Amount', 'Remarks', 'Owner', 'Date Purchased'];

        vm.initialize = initialize;
        vm.close = close;
        vm.onClickRow = onClickRow;
        vm.onReorder = onReorder;
        vm.removeFilter = removeFilter;

        vm.initialize();

        function initialize() {
            loadLots();

            //$scope.$watch(angular.bind(vm, function () {
            //    return vm.query.filter;
            //}), startFilter);
        }

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
            if(foundLot) gmapServices.triggerEvent(foundLot.polygon, 'click');
        }

        function loadLots() {
            Lots.getList()
                .then(function (result) {
                    console.log('Success fetching lots ', result);
                    $rootScope.lotList = result;
                    filterList();
                }, function (reason) {
                    console.log('Error when fetching lots: ',reason);
                });
        }
        //
        //function startFilter() {
        //    console.log('starting filter');
        //    console.log(vm.search);
        //    //for (var key in vm.searchSolarFilters) {
        //    //    console.log('key: '+key);
        //    //    if (vm.searchSolarFilters.hasOwnProperty(key)) {
        //    //        vm.searchSolarFilters[key] = vm.search;
        //    //    }
        //    //}
        //    //vm.searchSolarFilters.project_name = vm.search;
        //    vm.searchSolarFilters['$'] = vm.search;
        //    filterSolars();
        //}

        //function emptyFilter () {
        //    for (var key in vm.searchSolarFilters) {
        //        if (vm.searchSolarFilters.hasOwnProperty(key)) {
        //            vm.searchSolarFilters[key] = '';
        //        }
        //    }
        //}

        function filterList() {
            if (isEmptyFilter()) {
                $rootScope.lots = $rootScope.lotList;
            } else {
                var filtered = $filter('filter')($rootScope.lotList, vm.searchFilters, false);
                $rootScope.lots = filtered;
            }
        }

        function isEmptyFilter() {
            return vm.query.filter == '';
        }

        function close() {
            $mdDialog.hide();
        }
    }
}());