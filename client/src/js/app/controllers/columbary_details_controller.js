(function(){
'use strict';

angular.module('demoApp')
    .controller('columbaryDetailsController', ['$scope', '$mdDialog', 'columbary', 'modalServices', columbaryDetailsController]);

    function columbaryDetailsController ($scope, $mdDialog, columbary, modalServices) {
        var vm = this;

        $scope.forms = {};
        $scope.buttons = {};

        vm.columbary = null;

        vm.columbary_copy = null;

        vm.initialize = initialize;
        vm.markSold = markSold;
        vm.save = save;
        vm.cancel = cancel;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            vm.columbary = columbary;
            vm.columbary_copy = angular.copy(vm.columbary);
            console.log('columbary details: ', vm.columbary_copy);

            $scope.$watch(function () {
                return vm.columbary;
            }, function (newValue) {
                vm.columbary_copy = angular.copy(newValue);
            });
        }


        function markSold () {
            vm.columbary.status = 'sold';
            console.log('mark sold');

            modalServices.showClientSelection(vm.columbary)
                .then(function (success) {
                    console.log('ShowClientSelection: ', success);
                    vm.columbary.status = 'sold';
                }, function (err) {
                    console.log('ShowClientSelection: ', err);
                });
        }

        function save(event) {
            vm.columbary.save()
                .then(function(response){
                    console.log('updating columbary: ',response);
                    vm.columbary = response;
                    resetForms();
                    cancel(event);
                },function(error){
                    console.log('error updating columbary: ',error);
                });
        }

        function resetForms () {
            for(var key in $scope.forms) {
                $scope.forms[key] = false;
            }
            for (var key in $scope.buttons) {
                $scope.buttons[key] = true;
            }
        }

        function cancel (e) {
            $mdDialog.cancel()
                .finally(function(){
                    modalServices.showColumbaryList(e);
                });
        }
    }
}());