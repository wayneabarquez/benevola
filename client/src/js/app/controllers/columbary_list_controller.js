(function(){
'use strict';

angular.module('demoApp')
    .controller('columbaryListController', ['$mdDialog', columbaryListController]);

    function columbaryListController ($mdDialog) {
        var vm = this;

        vm.initialize = initialize;
        vm.close = close;

        vm.initialize();

        vm.colorTiles = (function () {
            var tiles = [];
            for (var i = 0; i < 96; i++) {
                tiles.push({
                    color: '#e53935'
                });
            }
            return tiles;
        })();


        function initialize () {}

        function close() {
            $mdDialog.cancel();
        }

    }
}());