(function () {
    'use strict';

    angular.module('demoApp')
        .factory('Blocks', ['Restangular', Blocks]);

    function Blocks(Restangular) {
        var model = Restangular.all('blocks');

        return angular.extend(model, {
            cast: function(block) {
              block.polygon = null;
              return Restangular.restangularizeElement(null, block, 'blocks');
            }
        });
    }
}());