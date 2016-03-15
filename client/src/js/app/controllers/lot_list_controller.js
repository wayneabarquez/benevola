(function () {
    'use strict';

    angular.module('demoApp')
        .controller('lotListController', ['$rootScope', '$scope', '$filter', lotListController]);

    function lotListController($rootScope, $scope, $filter) {
        var vm = this;

        // complete list of Solars from the server
        $rootScope.lotList = [];

        vm.query = {
            order: 'ShopCode',
            limit: 10,
            page: 1,
            filter: ''
        };

        vm.filter = {
            show: false,
            form: null
        };

        //vm.searchSolarFilters = {
        //    '$': ''
        //};

        // Table Header
        //vm.tableHeaderList = [
        //    {
        //        'name': 'project_name',
        //        'label': 'Project'
        //    },
        //    {
        //        'name': 'client_name',
        //        'label': 'Client'
        //    },
        //    {
        //        'name': 'state',
        //        'label': 'State'
        //    },
        //    {
        //        'name': 'status',
        //        'label': 'Status'
        //    }
        //];


        vm.initialize = initialize;
        vm.close = close;
        //vm.filterSolars = filterSolars;
        vm.onClickRow = onClickRow;
        //vm.viewSolarDetail = viewSolarDetail;
        vm.onReorder = onReorder;
        vm.removeFilter = removeFilter;

        vm.initialize();

        function initialize() {
            //loadSolars();

            //$scope.$watch(angular.bind(vm, function () {
            //    return vm.search;
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


        function onClickRow(solar) {
            // access solar var since it will be
            // transformed to restangular object

            console.log('Row Clicked! ');

            //if (solar && solar.id) {
            //    solarGmapServices.openSolarInfoWindowById(solar.id);
            //}
            return false;
        }

        //function viewSolarDetail(_solar) {
        //    $rootScope.$emit('show-solar-detail', {solar: _solar});
        //}

        //function loadSolars() {
        //    Solars.getList()
        //        .then(function (result) {
        //            console.log('Success fetching solars');
        //            //console.log(result);
        //            // always cache the latest result to serve whenever we're offline
        //            $rootScope.solarList = result;
        //            vm.filterSolars();
        //        }, function (reason) {
        //            console.log('Error when fetching solars');
        //            // serve previously cached result when offline
        //            //vm.solarList = storageServices.getSCIPs();
        //        });
        //}
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

        //function filterSolars() {
        //    // TODO: Add filter depend on role user authenticated
        //    // filter local list of solars
        //    // based on search criteria before
        //    // assigning to global list of solars
        //    if (isEmptyFilter()) {
        //        $rootScope.solars = $rootScope.solarList;
        //    } else {
        //        var filtered = $filter('filter')($rootScope.solarList, vm.searchSolarFilters, false);
        //
        //        $rootScope.solars = filtered;
        //    }
        //}
        //
        //function isEmptyFilter() {
        //    return vm.search === null || vm.search.trim() === '';
        //}

        function close() {
            $mdDialog.hide();
        }
    }
}());