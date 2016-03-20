(function(){
'use strict';

angular.module('demoApp')
    .controller('gmapController', ['$rootScope', 'gmapServices', 'LOT_COLORS', 'NAV_HEIGHT', gmapController]);

    function gmapController($rootScope, gmapServices, LOT_COLORS, NAV_HEIGHT) {

        var vm = this;

        vm.showLotLegend = true;
        vm.lotColors = LOT_COLORS;

        $rootScope.spinner = {
            active: false
        };

        vm.initialize = initialize;
        vm.toggleLotLegend = toggleLotLegend;

        vm.initialize();

        function initialize () {
            gmapServices.createMap('map-canvas', NAV_HEIGHT);
        }

        function toggleLotLegend () {
            vm.showLotLegend = !vm.showLotLegend;
        }
    }
}());