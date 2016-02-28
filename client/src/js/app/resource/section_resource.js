(function () {
    'use strict';

    angular.module('demoApp')
        .factory('Sections', ['Restangular', Sections]);

    function Sections(Restangular) {
        var resourceModel = Restangular.all('sections');

        Restangular.extendModel('sections', function (model) {

            //model.deletePanel = function (panel_id) {
            //    return model
            //        .one('panels', panel_id)
            //        .remove();
            //};

            //model.updatePhotoCaption = function (solarFile, newCaption) {
            //    console.log('custom solar method : updatePhotoCaption');
            //
            //    return model
            //        .one('photos', solarFile.id)
            //        .customPUT({caption: newCaption});
            //};

            return model;
        });

        return resourceModel;
    }
}());