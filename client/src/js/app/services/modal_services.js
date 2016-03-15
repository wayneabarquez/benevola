(function(){
'use strict';

angular.module('demoApp')
    .factory('modalServices', ['$mdDialog', '$mdMedia', '$rootScope', '$q', 'Settings', 'Clients', modalServices]);

    function modalServices ($mdDialog, $mdMedia, $rootScope, $q, Settings, Clients) {
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

        service.showLotDetailModal = null;
        service.showLotDetail = showLotDetail;

        service.showClientSelectionModal = null;
        service.showClientSelection = showClientSelection;

        service.showAddOccupantModal = null;
        service.showAddOccupant = showAddOccupant;

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

        function showLotDetail(lot) {
            var dfd = $q.defer();

            console.log('Show Lot Detail: ', lot);

            if (service.showLotDetailModal) {
                dfd.reject('Modal already opened');
            } else {
                $rootScope.$broadcast("modal-opened");

                lot.get().then(function(result){
                    service.showLotDetailModal = $mdDialog.show({
                        controller: 'lotDetailsController',
                        controllerAs: 'lotDetsCtl',
                        templateUrl: 'partials/modals/lot_details_dialog.tmpl.html',
                        parent: angular.element(document.body),
                        locals: {lot: result},
                        fullscreen: service.customFullscreen
                    });

                    service.showLotDetailModal.then(
                        function (result) {
                            dfd.resolve(result);
                        }, function (reason) {
                            $rootScope.$broadcast('modal-dismissed');
                            dfd.reject(reason);
                        })
                        .finally(function () {
                            service.showLotDetailModal = null;
                        })


                }, function(err){
                    console.log('Error: ',err);
                });

            }
            return dfd.promise;
        }

        function showClientSelection (lot) {
            var dfd = $q.defer();

            if (service.showClientSelectionModal) {
                dfd.reject('Modal already opened');
            } else {
                $rootScope.$broadcast("modal-opened");

                Clients.getList()
                    .then(function(resp) {

                        var clients = [];
                        resp.forEach(function(cl){
                           clients.push(cl);
                        });

                        console.log('Clients: ',resp);

                        service.showClientSelectionModal = $mdDialog.show({
                            controller: 'clientSelectionController',
                            controllerAs: 'clientSelectCtl',
                            templateUrl: 'partials/modals/lot_client_select_dialog.tmpl.html',
                            parent: angular.element(document.body),
                            locals: {lot: lot, clients: clients},
                            fullscreen: service.customFullscreen
                        });

                        service.showClientSelectionModal.then(
                            function (result) {
                                dfd.resolve(result);
                            }, function (reason) {
                                $rootScope.$broadcast('modal-dismissed');
                                dfd.reject(reason);
                            })
                            .finally(function () {
                                service.showClientSelectionModal = null;
                            });

                    }, function(err) {
                        console.log('Error fetching clients: ',err);
                    });
            }
            return dfd.promise;
        }

        function showAddOccupant(lot) {
            var dfd = $q.defer();

            if (service.showAddOccupantModal) {
                dfd.reject('Modal already opened');
            } else {
                $rootScope.$broadcast("modal-opened");

                service.showAddOccupantModal = $mdDialog.show({
                    controller: 'addLotOccupantController',
                    controllerAs: 'addLotOcptCtl',
                    templateUrl: 'partials/modals/add_lot_occupant_dialog.tmpl.html',
                    parent: angular.element(document.body),
                    locals: {lot: lot},
                    fullscreen: service.customFullscreen
                });

                service.showAddOccupantModal.then(
                    function (result) {
                        dfd.resolve(result);
                    }, function (reason) {
                        $rootScope.$broadcast('modal-dismissed');
                        dfd.reject(reason);
                    })
                    .finally(function () {
                        service.showAddOccupantModal = null;
                    });
            }
            return dfd.promise;
        }

        return service;
    }
}());