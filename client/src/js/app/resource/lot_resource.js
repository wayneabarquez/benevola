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

            model.updateORNo = function (ORNo) {
                console.log('update lot or no: ', ORNo);

                return model
                    .all('or_no')
                    .customPUT(ORNo);
            };

            model.updateRemarks = function (data) {
                console.log('update remarks: ', data);

                return model
                    .all('remarks')
                    .customPUT(data);
            };

            model.updateName = function (data) {
                console.log('update name: ', data);

                return model
                    .all('name')
                    .customPUT(data);
            };

            model.updateLotArea = function (data) {
                console.log('update lot area: ', data);

                return model
                    .all('lot_area')
                    .customPUT(data);
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