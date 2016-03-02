(function(){
'use strict';

angular.module('demoApp')
    .controller('addBlockController', ['$mdDialog', 'section', 'area', addBlockController]);

    function addBlockController ($mdDialog, section, area) {
        var vm = this;

        vm.block = {
            area: area,
            name: ''
        };

        vm.save = save;
        vm.cancel = cancel;

        /* Controller Functions here */

        function save () {
            //if (typeof section.addBlock == 'function') {

            section.addBlock(vm.block)
                .then(function(response){
                    $mdDialog.hide(response);
                }, function(error){
                    console.log('Error: ', error);
                });

            //} else {
            //    console.log('function section.addBlock doesnt exist!');
            //}
        }

        function cancel () {
            $mdDialog.cancel();
        }

    }
}());