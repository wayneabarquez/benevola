(function () {
'use strict';

angular.module('demoApp')
    .factory('alertServices', ['$mdToast', 'SweetAlert', alertServices]);

    function alertServices($mdToast, SweetAlert) {
        var service = {};

        service.showTopRightToast = showTopRightToast;
        service.showMessage = showMessage;
        service.showPrompt = showPrompt;
        service.showLotAdded = showLotAdded;
        service.settingsSuccessfullySaved = settingsSuccessfullySaved;
        service.showErrorMessage = showErrorMessage;

        function showToast(message, position) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position(position)
                    .hideDelay(2000)
            );
        }

        function showTopRightToast(message) {
            showToast(message, 'top right');
        }

        function showMessage(message, type) {
            SweetAlert.swal({
                title: message,
                type: type
            });
        }

        function showLotAdded () {
            service.showTopRightToast('Lot Added.');
        }

        function settingsSuccessfullySaved () {
            showMessage('Settings Updated!', 'success');
        }

        function showErrorMessage (error) {
            showMessage(error, 'error');
        }

        function showPrompt(entity, callback) {
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Deleting " + entity,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
                closeOnConfirm: false,
                closeOnCancel: false
            }, callback);
        }

        return service;
    }
}());