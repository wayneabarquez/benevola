(function(){
'use strict';

angular.module('demoApp')
    .controller('addSectionController', ['$mdDialog', 'area', 'Sections', addSectionController]);

    function addSectionController ($mdDialog, area, Sections) {
        var vm = this;

        vm.section = {
            area: area,
            name: ''
        };

        vm.save = save;
        vm.cancel = cancel;

        /* Controller Functions here */

        function save () {
            console.log('saving section: ', vm.section);

            Sections.post(vm.section)
                .then(function(response){
                    console.log('Success posting in sections: ',response);

                    $mdDialog.hide();
                }, function(error){
                    console.log('Error: ', error);
                });
        }

        function cancel () {
            $mdDialog.cancel();
        }

    }
}());