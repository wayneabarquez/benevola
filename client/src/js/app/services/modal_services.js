(function(){
'use strict';

angular.module('demoApp')
    .factory('modalServices', ['$mdDialog', '$mdMedia', '$rootScope', '$q', modalServices]);

    function modalServices ($mdDialog, $mdMedia, $rootScope, $q) {
        var service = {};

        service.customFullscreen = $mdMedia('sm') || $mdMedia('xs');

        service.addSectionModal = null;
        service.addBlockModal = null;

        service.showAddSection = showAddSection;
        service.showAddBlock = showAddBlock;

        function showAddSection (event, sectionArea) {
            var dfd = $q.defer();

            if(service.addSectionModal) {
                dfd.reject('Modal already opened');
            } else {
                $rootScope.$broadcast("modal-opened");

                service.addSectionModal = $mdDialog.show({
                    controller: 'addSectionController',
                    controllerAs: 'addSectionCtl',
                    templateUrl: 'partials/modals/add_section_dialog.tmpl.html',
                    parent: angular.element(document.body),
                    locals: {area: sectionArea},
                    targetEvent: event,
                    fullscreen: service.customFullscreen
                });

                service.addSectionModal.then(
                   function(result) {
                    service.addSectionModal = null;
                    dfd.resolve(result);
                }, function (reason) {
                    $rootScope.$broadcast('modal-dismissed');
                    service.addSectionModal = null;
                    dfd.reject(reason);
                });
            }
            return dfd.promise;
        }

        function showAddBlock(event, section, sectionArea) {
            var dfd = $q.defer();

            if (service.addBlockModal) {
                dfd.reject('Modal already opened');
            } else {
                $rootScope.$broadcast("modal-opened");

                service.addBlockModal = $mdDialog.show({
                    controller: 'addBlockController',
                    controllerAs: 'addBlockCtl',
                    templateUrl: 'partials/modals/add_block_dialog.tmpl.html',
                    parent: angular.element(document.body),
                    locals: {section: section, area: sectionArea},
                    targetEvent: event,
                    fullscreen: service.customFullscreen
                });

                service.addBlockModal.then(
                    function (result) {
                        service.addBlockModal = null;
                        dfd.resolve(result);
                    }, function (reason) {
                        $rootScope.$broadcast('modal-dismissed');
                        service.addBlockModal = null;
                        dfd.reject(reason);
                    });
            }
            return dfd.promise;
        }

        return service;
    }
}());