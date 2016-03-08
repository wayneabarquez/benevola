(function(){
'use strict';

angular.module('demoApp')
    .controller('gmapController', ['$rootScope', 'gmapServices', 'NAV_HEIGHT', gmapController]);

    function gmapController($rootScope, gmapServices, NAV_HEIGHT) {

        var vm = this;

        $rootScope.spinner = {
            active: false
        };

        vm.initialize = initialize;

        vm.initialize();

        function initialize () {
            gmapServices.createMap('map-canvas', NAV_HEIGHT);
        }
    }
}());