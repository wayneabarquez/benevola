(function () {
'use strict';

angular.module('demoApp')
    .factory('alertServices', ['$mdToast', 'SweetAlert', alertServices]);

    function alertServices($mdToast, SweetAlert) {
        var service = {};

        service.showTopRightToast = showTopRightToast;
        service.showLotAdded = showLotAdded;
        service.settingsSuccessfullySaved = settingsSuccessfullySaved;

        function showTopRightToast(message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('top right')
                    .hideDelay(2000)
            );
        }

        function showLotAdded () {
            service.showTopRightToast('Lot Added.');
        }

        function settingsSuccessfullySaved () {
            SweetAlert.swal({
                title: 'Settings Updated!',
                type: 'success'
            });
        }

        return service;
    }
}());