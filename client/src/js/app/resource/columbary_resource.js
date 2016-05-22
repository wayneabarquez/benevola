(function () {
    'use strict';

    angular.module('demoApp')
        .factory('Columbary', ['Restangular', Columbary]);

    function Columbary(Restangular) {
        var model = Restangular.all('columbary');

        return angular.extend(model, {
            cast: function (c) {
                return Restangular.restangularizeElement(null, c, 'columbary');
            }
        });
    }
}());