(function () {
    'use strict';

    angular.module('demoApp')
        .factory('Lots', ['Restangular', Lots]);

    function Lots(Restangular) {
        var model = Restangular.all('lots');

        Restangular.extendModel('lots', function (model) {

            model.updateDimension = function (dimension) {
                //console.log('update lot dimension: ', dimension);

                return model
                    .all('dimension')
                    .customPUT(dimension);
            };

            model.updatePrice = function (newPrice) {
                console.log('update lot price: ', newPrice);

                return model
                    .all('price')
                    .customPUT(newPrice);
            };

            return model;
        });

        return angular.extend(model, {
            cast: function(lot) {
              lot.polygon = null;
              return Restangular.restangularizeElement(null, lot, 'lots');
            }
        });
    }
}());