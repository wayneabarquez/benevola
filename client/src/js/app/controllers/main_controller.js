(function(){
'use strict';

angular.module('demoApp')
    .controller('mainController', ['$rootScope', 'BASE_URL', 'modalServices', mainController]);

    function mainController ($rootScope, BASE_URL, modalServices) {
        var vm = this;

        $rootScope.spinner = {
            active: false
        };

        vm.menu = [
            {
                link: '/admin',
                title: 'Admin',
                icon: 'group'
            },
            {
                title: 'Settings',
                icon: 'settings'
            },
            {
                link: '/logout',
                title: 'Logout',
                icon: 'exit_to_app'
            }
        ];

        //vm.initialize = initialize;
        vm.redirect = redirect;
        vm.openSettings = openSettings;

        //vm.initialize();
        //
        //function initialize () {
        //    sectionList.loadSections(); // Transferred to Admin Controller
        //}

        function redirect(e, link) {
            e.preventDefault();

            if(link == '/admin'  || link == '/logout') {
                console.log('link: ', link);
                window.location = BASE_URL + link;
                return;
            }

            vm.openSettings(e);
        }

        function openSettings (e) {
            modalServices.showSettings(e);
        }

    }
}());