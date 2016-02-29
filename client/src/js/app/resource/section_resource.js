(function () {
    'use strict';

    angular.module('demoApp')
        .factory('Sections', ['Restangular', Sections]);

    function Sections(Restangular) {
        var resourceModel = Restangular.all('sections');

        Restangular.extendModel('sections', function (model) {

            model.addBlock = function (block) {
                return model
                    .all('blocks')
                    .customPOST(block);
            };

            return model;
        });

        return resourceModel;
    }
}());