(function () {
    'use strict';

    angular
        .module('demoApp', ['ngMaterial', 'ngAnimate', 'restangular', 'oitozero.ngSweetAlert', 'treasure-overlay-spinner'])

        .constant('BASE_URL', window.location.origin)
        .constant('NAV_HEIGHT', 50)

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('pink');
        })

        .config(['RestangularProvider', function (RestangularProvider) {
            //set the base url for api calls on our RESTful services
            RestangularProvider.setBaseUrl(window.location.origin + '/api');
        }]);

    console.log('benevola app initialized');

}());

