(function () {
    'use strict';

    angular.module('demoApp')
        .factory('Deceased', ['Restangular', Deceased]);

    function Deceased(Restangular) {
        var model = Restangular.all('deceased');

        return angular.extend(model, {
            cast: function(deceased) {
              return Restangular.restangularizeElement(null, deceased, 'deceased');
            }
        });
    }
}());