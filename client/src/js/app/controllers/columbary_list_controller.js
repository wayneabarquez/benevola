(function(){
'use strict';

angular.module('demoApp')
    .controller('columbaryListController', ['$mdDialog', 'Columbary', 'modalServices', columbaryListController]);

    function columbaryListController ($mdDialog, Columbary, modalServices) {
        var vm = this;

        vm.tiles = [];

        vm.filter = {
          block: 'A'
        };

        vm.pages = {};

        vm.initialize = initialize;
        vm.changePage = changePage;
        vm.filterChange = filterChange;
        vm.showColumbaryDetail = showColumbaryDetail;
        vm.close = close;

        vm.initialize();

        function initialize () {
            getData();
        }

        function filterChange () {
            getData(vm.pages.page, vm.filter.block);
        }

        function showColumbaryDetail (c) {
            console.log('show columbary detail: ',c);
            modalServices.showColumbaryDetail(c);
        }

        function getData(pageNo, block) {
            var params = {};

            params['page'] = pageNo || 1;
            if(block) params['block'] = block;

            Columbary.get('', params)
                .then(function (response) {
                    console.log('response: ',response);

                    vm.tiles = [];
                    if (response.columbary) {
                        response.columbary.forEach(function (item) {
                            vm.tiles.push(Columbary.cast(item));
                        });
                    }

                    if (response.pages) vm.pages = response.pages;

                }, function (error) {
                    console.log('error getting columbary: ', error);
                });
        }

        function changePage (pageNo) {
            getData(pageNo, vm.filter.block);
        }

        function close() {
            $mdDialog.cancel();
        }
    }
}());