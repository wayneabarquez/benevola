(function(){
'use strict';

angular.module('demoApp')
    .controller('columbaryTableController', ['$scope', '$mdDialog', 'columbaryServices', 'Columbary', 'modalServices', '$timeout', 'LOT_STATUSES', columbaryTableController]);

    function columbaryTableController ($scope, $mdDialog, columbaryServices, Columbary, modalServices, $timeout, LOT_STATUSES) {
        var vm = this;

        vm.statusChoices = [''].concat(LOT_STATUSES);

        vm.columbaryItems = [];

        vm.query = {
            order: 'c_no',
            max_per_page: 10,
            page: 1,
            filter: '',
            block: 'A',
            status: ''
        };

        vm.columbary = {
            pages: null
        };

        vm.filter = {
            show: false,
            form: null
        };

        vm.searchFilters = {
            c_no: "",
            amount: "",
            status: "",
            client_name: ""
        };

        // Table Header
        vm.tableHeaderList = [
            'Block',
            'Columbary No.',
            'Amount',
            'Status',
            'OR #',
            'Owner',
            'Date Purchased',
            'Action'
        ];

        vm.initialize = initialize;
        vm.onReorder = onReorder;
        vm.removeFilter = removeFilter;
        vm.showDetails = showDetails;
        vm.blockChange = blockChange;
        vm.statusChange = statusChange;
        vm.close = close;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            getData();

            $scope.$watch(angular.bind(vm, function () {
                return vm.query.filter;
            }), startFilter);
        }

        function getData() {
            columbaryServices.getAllData()
                .then(function (columbaryList) {
                    vm.columbaryItems = filterByBlock(columbaryList, vm.query.block);
                }, function (error) { console.log('error getting columbary: ', error); });
        }

        function filterByBlock (list, block) {
            return _.where(list, {block: block});
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
            vm.columbaryItems = isEmptyFilter()
                                ? columbaryServices.filterByBlock(vm.query.block)
                                : manualFilter(vm.searchFilters);
        }

        function manualFilter(searchFilters) {
            var result = [];
            columbaryServices.columbaryList.forEach(function (c) {
                for (var key in searchFilters) {
                    var data = String(c[key]).toLowerCase();
                    if (data.indexOf(vm.query.filter) !== -1) {
                        result.push(c);
                        return;
                    }
                }
            });
            return result;
        }

        function isEmptyFilter() {
            return vm.query.filter === '';
        }

        /* Table Functions */

        function onReorder() {}

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';
            vm.query.status = '';

            if (vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }

            vm.columbaryItems = columbaryServices.filterByBlock(vm.query.block);
        }

        function showDetails (c) {
            modalServices.showColumbaryDetail(c)
                .finally(function(){
                    $timeout(function(){
                        modalServices.showColumbaryTable();
                    });
                });
        }

        function blockChange () {
            vm.columbaryItems = columbaryServices.filterByBlock(vm.query.block);
        }

        function statusChange () {
            vm.columbaryItems = vm.query.status
                                ? columbaryServices.filterByStatus(vm.query.status)
                                : columbaryServices.filterByStatus('', vm.query.block);
        }

        function close() {
            $mdDialog.hide();
        }

    }
}());