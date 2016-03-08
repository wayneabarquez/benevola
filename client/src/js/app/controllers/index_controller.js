(function(){
'use strict';

angular.module('demoApp')
    .controller('indexController', ['sectionList', indexController]);

    function indexController (sectionList) {
        var vm = this;

        vm.initialize = initialize;

        vm.initialize();

        function initialize () {
            sectionList.loadSections(true);
        }
    }
}());