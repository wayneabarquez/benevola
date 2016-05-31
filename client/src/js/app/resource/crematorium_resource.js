(function () {
    'use strict';

    angular.module('demoApp')
        .factory('Crematorium', ['Restangular', Crematorium]);

    function Crematorium(Restangular) {
        var model = Restangular.all('crematorium');

        return angular.extend(model, {
            cast: function (c) {
                return Restangular.restangularizeElement(null, c, 'crematorium');
            }
        });
    }
}());