(function(){
'use strict';

angular.module('demoApp')
    .controller('gmapController', ['$scope', '$rootScope', 'gmapServices', 'LOT_COLORS', 'NAV_HEIGHT', gmapController]);

    function gmapController($scope, $rootScope, gmapServices, LOT_COLORS, NAV_HEIGHT) {

        var vm = this;

        vm.lotStatusFilters = {
          all: true,
          vacant: true,
          sold: true,
          occupied: true
        };

        vm.showLotLegend = true;
        vm.lotColors = LOT_COLORS;

        vm.getLotsCountByStatus = getLotsCountByStatus;

        $rootScope.spinner = {
            active: false
        };

        vm.initialize = initialize;
        vm.toggleLotLegend = toggleLotLegend;

        vm.initialize();

        function initialize () {
            gmapServices.createMap('map-canvas', NAV_HEIGHT);

            $scope.$watchCollection(function(){
                return vm.lotStatusFilters;
            }, watchLotStatusFilters);

        }

        function watchLotStatusFilters (lotStatusFilters, oldLotStatusFilters) {
            // All Lot Filters
            if(lotStatusFilters.all !== oldLotStatusFilters.all) {
                for(var key in vm.lotStatusFilters) {
                    if(key !== 'all') {
                        vm.lotStatusFilters[key] = lotStatusFilters.all;
                    }
                }

                $rootScope.$broadcast('toggle-lot-polygons', {status: 'all', value: lotStatusFilters.all});
                return;
            }

            for (var key in vm.lotStatusFilters) {
                if (lotStatusFilters[key] !== oldLotStatusFilters[key]) {
                    $rootScope.$broadcast('toggle-lot-polygons', {status: key, value: lotStatusFilters[key]});
                }
            }
        }

        function toggleLotLegend () {
            vm.showLotLegend = !vm.showLotLegend;
        }

        function getLotsCountByStatus (status) {

            return $rootScope.lotsDetail.count[status.toLowerCase()];
        }
    }
}());