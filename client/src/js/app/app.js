(function () {
    'use strict';

    angular
        .module('demoApp', ['ngMaterial', 'ngMessages', 'ngAnimate', 'restangular',
            'oitozero.ngSweetAlert', 'treasure-overlay-spinner', 'md.data.table',
            'angularMoment', 'angularInlineEdit'
        ])

        .constant('BASE_URL', window.location.origin)
        .constant('NAV_HEIGHT', 0)

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('pink');
        })

        .config(['RestangularProvider', function (RestangularProvider) {
            //set the base url for api calls on our RESTful services
            RestangularProvider.setBaseUrl(window.location.origin + '/api');
        }]);

}());

