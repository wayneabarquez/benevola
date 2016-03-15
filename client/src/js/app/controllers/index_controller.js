(function(){
'use strict';

angular.module('demoApp')
    .controller('indexController', ['sectionList', indexController]);

    function indexController (sectionList) {
        var vm = this;

        vm.showList = false;

        vm.initialize = initialize;
        vm.toggleList = toggleList;

        vm.initialize();

        function initialize () {
            sectionList.loadSections(true);
        }

        function toggleList() {
            vm.showList = !vm.showList;
        }
    }
}());