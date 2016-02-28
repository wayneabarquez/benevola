(function(){
'use strict';

angular.module('demoApp')
    .controller('adminGmapController', ['$rootScope', 'gmapServices', adminGmapController]);

    function adminGmapController($rootScope, gmapServices) {

        var vm = this;

        $rootScope.spinner = {
            active: false
        };

        vm.initialize = initialize;

        vm.initialize();

        function initialize () {
            gmapServices.createMap('admin-map-canvas', 0);
        }

    }
}());