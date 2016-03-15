(function () {
    'use strict';

    angular.module('demoApp')
        .factory('Clients', ['Restangular', Clients]);

    function Clients(Restangular) {
        var model = Restangular.all('clients');

        return angular.extend(model, {
            cast: function(client) {
              return Restangular.restangularizeElement(null, client, 'clients');
            }
        });
    }
}());