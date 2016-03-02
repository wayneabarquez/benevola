(function(){
'use strict';

angular.module('demoApp')
    .controller('addLotController', ['$mdDialog', 'block', 'area', addLotController]);

    function addLotController ($mdDialog, block, area) {
        var vm = this;

        vm.lot = {
            area: area,
            name: ''
        };

        vm.save = save;
        vm.cancel = cancel;

        /* Controller Functions here */

        function save () {
            //block.addLot(vm.lot)
            //    .then(function(response){
            //        $mdDialog.hide(response);
            //    }, function(error){
            //        console.log('Error: ', error);
            //    });
        }

        function cancel () {
            $mdDialog.cancel();
        }

    }
}());