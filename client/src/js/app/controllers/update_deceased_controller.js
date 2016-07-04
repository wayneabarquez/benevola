(function () {
    'use strict';

    angular.module('demoApp')
        .controller('updateDeceasedController', ['deceased', '$rootScope', '$scope', 'modalServices', updateDeceasedController]);

    function updateDeceasedController(deceased, $rootScope, $scope, modalServices) {
        var vm = this;

        vm.deceased = {};

        vm.save = save;
        vm.cancel = cancel;
        vm.clearForm = clearForm;


        $scope.maxDate = new Date();

        /* Controller Functions here */

        function initialize() {
            vm.deceased = deceased;
            console.log('deceased: ', deceased);
        }

        function save() {
            vm.deceased.put()
                .then(function (response) {
                    console.log('Update Deceased: ', response);
                    //$mdDialog.hide();
                }, function (err) {
                    console.log('Error Updating deceased: ', err);
                });
        }

        function cancel() {
            modalServices.closeModal();
        }

        function clearForm() {
            vm.deceased = {};
            $scope.updateDeceasedForm.$setPristine();
        }

        initialize();

    }
}());