(function(){
'use strict';

angular.module('demoApp')
    .controller('gmapController', ['$rootScope', 'gmapServices', 'LOT_COLORS', 'NAV_HEIGHT', 'modalServices', gmapController]);

    function gmapController($rootScope, gmapServices, LOT_COLORS, NAV_HEIGHT, modalServices) {

        var vm = this;

        vm.lotColors = LOT_COLORS;

        $rootScope.spinner = {
            active: false
        };

        vm.initialize = initialize;

        vm.initialize();

        function initialize () {
            gmapServices.createMap('map-canvas', NAV_HEIGHT);

            $rootScope.$on('show-lot-detail', function(event, params) {
               var lot = params.lot;

               lot.get()
                   .then(function(response){
                       modalServices.showLotDetail(response)
                           .then(function (response) {

                           }, function (err) {

                           });
                   });

            });
        }
    }
}());