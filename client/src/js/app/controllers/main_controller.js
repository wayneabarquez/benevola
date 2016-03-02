(function(){
'use strict';

angular.module('demoApp')
    .controller('mainController', ['sectionList', 'blockList', mainController]);

    function mainController (sectionList, blockList) {
        var vm = this;

        vm.menu = [
            {
                link: '/admin',
                title: 'Admin',
                icon: 'group'
            },
            {
                link: '/logout',
                title: 'Logout',
                icon: 'exit_to_app'
            }
        ];

        vm.initialize = initialize;

        vm.initialize();

        function initialize () {
            sectionList.loadSections();
        }

    }
}());