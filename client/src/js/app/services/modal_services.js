(function(){
'use strict';

angular.module('demoApp')
    .factory('modalServices', ['$mdDialog', '$mdMedia', '$rootScope', '$q', 'Settings', modalServices]);

    function modalServices ($mdDialog, $mdMedia, $rootScope, $q, Settings) {
        var service = {};

        service.customFullscreen = $mdMedia('sm') || $mdMedia('xs');

        service.settingsModal = null;
        service.showSettings = showSettings;

        service.addSectionModal = null;
        service.addBlockModal = null;
        service.addLotModal = null;

        service.showAddSection = showAddSection;
        service.showAddBlock = showAddBlock;
        service.showAddLot = showAddLot;

        function showSettings(event) {
            var dfd = $q.defer();

            if (service.settingsModal) {
                dfd.reject('Modal already opened');
            } else {
                $rootScope.$broadcast("modal-opened");

                Settings.customGET('last_lot_price')
                    .then(function(lastLot){
                        console.log('get last lot price: ',lastLot);

                        service.settingsModal = $mdDialog.show({
                            controller: 'settingsController',
                            controllerAs: 'settingsCtl',
                            templateUrl: 'partials/modals/settings_dialog.tmpl.html',
                            parent: angular.element(document.body),
                            targetEvent: event,
                            locals: {lastLot: lastLot},
                            fullscreen: service.customFullscreen
                        });

                        service.settingsModal.then(
                            function (result) {
                                dfd.resolve(result);
                            }, function (reason) {
                                $rootScope.$broadcast('modal-dismissed');
                                dfd.reject(reason);
                            })
                            .finally(function () {
                                service.settingsModal = null;
                            });

                    }, function(er){
                        console.log('er: ',er);
                    });
            }
            return dfd.promise;
        }

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
                    dfd.resolve(result);
                }, function (reason) {
                    $rootScope.$broadcast('modal-dismissed');
                    dfd.reject(reason);
                })
                .finally(function () {
                    service.addSectionModal = null;
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
                        dfd.resolve(result);
                    }, function (reason) {
                        $rootScope.$broadcast('modal-dismissed');
                        dfd.reject(reason);
                    })
                    .finally(function () {
                        service.addBlockModal = null;
                    });
            }
            return dfd.promise;
        }

        function showAddLot(event, block, area) {
            var dfd = $q.defer();

            if (service.addLotModal) {
                dfd.reject('Modal already opened');
            } else {
                $rootScope.$broadcast("modal-opened");

                service.addLotModal = $mdDialog.show({
                    controller: 'addLotController',
                    controllerAs: 'addLotCtl',
                    templateUrl: 'partials/modals/add_lot_dialog.tmpl.html',
                    parent: angular.element(document.body),
                    locals: {block: block, area: area},
                    targetEvent: event,
                    fullscreen: service.customFullscreen
                });

                service.addLotModal.then(
                    function (result) {
                        dfd.resolve(result);
                    }, function (reason) {
                        $rootScope.$broadcast('modal-dismissed');
                        dfd.reject(reason);
                    })
                    .finally(function(){
                        service.addLotModal = null;
                    })
            }
            return dfd.promise;
        }

        return service;
    }
}());