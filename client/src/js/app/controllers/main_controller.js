(function(){
'use strict';

angular.module('demoApp')
    .controller('mainController', [mainController]);

    function mainController () {
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

    }
}());