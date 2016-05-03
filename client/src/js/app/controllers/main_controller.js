(function(){
'use strict';

angular.module('demoApp')
    .controller('mainController', ['$scope', '$rootScope', 'BASE_URL', 'modalServices', mainController]);

    function mainController ($scope, $rootScope, BASE_URL, modalServices) {
        var vm = this;

        $rootScope.spinner = {
            active: false
        };

        $rootScope.currentUser = {
          username: 'User1',
          role: 'USER'
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

        vm.isFabOpen = false;
        vm.tooltipVisible = false;

        vm.initialize = initialize;
        vm.redirect = redirect;
        vm.openSettings = openSettings;

        vm.generateLotListReport = generateLotListReport;
        vm.generateSalesReport = generateSalesReport;

        vm.initialize();

        function initialize () {
            // TODO: fetch logged in user data
            // and add in local storage

            $scope.$watch(function(){
                return vm.isFabOpen;
            }, function(newValue, oldValue){
                if(newValue === oldValue) return;
                vm.tooltipVisible = vm.isFabOpen;
            });
        //    sectionList.loadSections(); // Transferred to Admin Controller
        }

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

        function generateLotListReport () {
            window.open(BASE_URL + '/reports/lot_list');
        }

        function generateSalesReport () {
            console.log('generate sales report');
            modalServices.showSalesReport();
        }

    }
}());