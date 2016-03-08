(function () {
    'use strict';

    angular.module('demoApp')
        .factory('Settings', ['Restangular', Settings]);

    function Settings(Restangular) {
        var resourceModel = Restangular.all('settings');

        Restangular.extendModel('settings', function (model) {

            model.getLastLotPrice = function () {
                return model
                    .customGET('lastLot_price');
            };

            return model;
        });


        return resourceModel;
    }
}());