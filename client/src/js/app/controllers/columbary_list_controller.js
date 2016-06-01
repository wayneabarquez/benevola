(function(){
'use strict';

angular.module('demoApp')
    .controller('columbaryListController', ['$scope', '$mdDialog', 'Columbary', 'modalServices', 'columbaryServices', columbaryListController]);

    function columbaryListController ($scope, $mdDialog, Columbary, modalServices, columbaryServices) {
        var vm = this;

        vm.tiles = [];
        var tempTiles = [];

        //vm.statusChoices = [''].concat(LOT_STATUSES);

        vm.query = {
            filter: ''
        };

        vm.filter = {
          form: null,
          block: 'A'
        };

        vm.searchFilters = {
            c_no: "",
            status: "",
            client_name: ""
        };

        vm.pages = {};

        vm.initialize = initialize;
        vm.changePage = changePage;
        vm.filterChange = filterChange;
        vm.showColumbaryDetail = showColumbaryDetail;
        vm.showColumbaryTable = showColumbaryTable;
        vm.removeFilter = removeFilter;
        vm.close = close;

        vm.initialize();

        function initialize () {
            columbaryServices.getAllData();
            getData();

            $scope.$watch(angular.bind(vm, function () {
                return vm.query.filter;
            }), startFilter);
        }

        function filterChange () {
            getData(vm.pages.page, vm.filter.block);
        }

        function showColumbaryDetail (c) {
            modalServices.showColumbaryDetail(c);
        }

        function getData(pageNo, block) {
            var _pageNo = pageNo || 1,
                _block = block ? block : null;

            columbaryServices.getData(_pageNo, _block)
                .then(function (response) {
                    vm.tiles = [];

                    if (response.columbary) {
                        response.columbary.forEach(function (item) {
                            vm.tiles.push(Columbary.cast(item));
                        });
                    }

                    tempTiles = angular.copy(vm.tiles);

                    if (response.pages) vm.pages = response.pages;

                }, function (error) { console.log('error getting columbary: ', error); });
        }

        function changePage (pageNo) {
            getData(pageNo, vm.filter.block);
        }

        function showColumbaryTable () {
            modalServices.showColumbaryTable();
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
            if (vm.query.filter === '') {
                getData();
            } else {
                vm.tiles = manualFilter(vm.searchFilters);
            }
        }

        function manualFilter(searchFilters) {
            var result = [];
            columbaryServices.columbaryList.forEach(function (c) {
                for (var key in searchFilters) {
                    var data = String(c[key]).toLowerCase();
                    if (data.indexOf(vm.query.filter) !== -1 && c['block'] == vm.filter.block) {
                        result.push(c);
                        return;
                    }
                }
            });
            return result;
        }

        function removeFilter() {
            vm.query.filter = '';

            //if (vm.filter.form && vm.filter.form.$dirty) {
            //    vm.filter.form.$setPristine();
            //}

            $scope.showFilterColumbary = false

            getData();
        }

        function close() {
            $mdDialog.cancel();
        }
    }
}());