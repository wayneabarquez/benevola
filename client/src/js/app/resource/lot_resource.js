(function () {
    'use strict';

    angular.module('demoApp')
        .factory('Lots', ['Restangular', Lots]);

    function Lots(Restangular) {
        var model = Restangular.all('lots');

        return angular.extend(model, {
            cast: function(lot) {
              lot.polygon = null;
              return Restangular.restangularizeElement(null, lot, 'lots');
            }
        });
    }
}());