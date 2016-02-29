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
            section.addBlock(vm.block)
                .then(function(response){
                    console.log('Success add block: ',response);
                    $mdDialog.hide(response);
                }, function(error){
                    console.log('Error: ', error);
                });
        }

        function cancel () {
            $mdDialog.cancel();
        }

    }
}());