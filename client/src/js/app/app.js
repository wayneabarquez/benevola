(function () {
    'use strict';

    angular
        .module('demoApp', ['ngMaterial', 'ngMessages', 'ngAnimate', 'restangular',
            'oitozero.ngSweetAlert', 'treasure-overlay-spinner', 'md.data.table',
            'angularMoment', 'angularInlineEdit', 'ngMaterialDatePicker'
        ])

        .constant('BASE_URL', window.location.origin)
        .constant('NAV_HEIGHT', 0)
        .constant('LOT_STATUSES', ['vacant', 'sold', 'occupied'])

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('pink');
        })

        //.config(['uiMask.ConfigProvider', function (uiMaskConfigProvider) {
        //    uiMaskConfigProvider.maskDefinitions({'*': /[xX0-9]/});
        ////    //uiMaskConfigProvider.clearOnBlur(false);
        ////    //uiMaskConfigProvider.eventsToHandle(['input', 'keyup', 'click']);
        //}])

        .config(['RestangularProvider', function (RestangularProvider) {
            //set the base url for api calls on our RESTful services
            RestangularProvider.setBaseUrl(window.location.origin + '/api');
        }]);

}());

