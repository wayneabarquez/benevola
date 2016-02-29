(function () {
    'use strict';

    angular.module('demoApp')
        .factory('Blocks', ['Restangular', Blocks]);

    function Blocks(Restangular) {
        var resourceModel = Restangular.all('blocks');

        Restangular.extendModel('blocks', function (model) {

            //model.addBlock = function (block) {
            //    return model
            //        .all('blocks')
            //        .customPOST(block);
            //};

            return model;
        });

        return resourceModel;
    }
}());