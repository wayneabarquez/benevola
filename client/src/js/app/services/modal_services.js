(function(){
'use strict';

angular.module('demoApp')
    .factory('modalServices', ['$mdDialog', '$mdMedia', '$rootScope', '$q', 'Settings', 'Clients', modalServices]);

    function modalServices ($mdDialog, $mdMedia, $rootScope, $q, Settings, Clients) {
        var service = {};

        service.customFullscreen = $mdMedia('sm') || $mdMedia('xs');

        service.closeModal = closeModal;

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

        service.showColumbaryDetailModal = null;
        service.showColumbaryDetail = showColumbaryDetail;

        service.showClientSelectionModal = null;
        service.showClientSelection = showClientSelection;

        service.showAddOccupantModal = null;
        service.showAddOccupant = showAddOccupant;

        service.salesReportModal = null;
        service.showSalesReport = showSalesReport;

        service.showColumbaryListModal = null;
        service.showColumbaryList = showColumbaryList;

        var showColumbaryTableModal = null;
        service.showColumbaryTable = showColumbaryTable;

        var showCrematoriumModal = null;
        service.showCrematorium = showCrematorium;

        function showModal(modalObj, modalParams) {
            var dfd = $q.defer();
            if (modalObj) {
                dfd.reject("Modal already opened");
            } else {
                $rootScope.$broadcast("modal-opened");
                modalObj = $mdDialog.show(modalParams);
                modalObj.then(function (result) {
                        dfd.resolve(result);
                    }, function (reason) {
                        $rootScope.$broadcast("modal-dismissed");
                        dfd.reject(reason);
                    })
                    .finally(function () {
                        modalObj = null;
                    });
            }
            return dfd.promise;
        }

        function showSettings(ev) {
            var dfd = $q.defer();

            Settings.customGET('last_lot_price')
                .then(function(lastLot) {
                    console.log('get last lot price: ', lastLot);
                    var opts = {
                        controller: 'settingsController',
                        controllerAs: 'settingsCtl',
                        templateUrl: 'partials/modals/settings_dialog.tmpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: {lastLot: lastLot},
                        fullscreen: service.customFullscreen
                    };
                    dfd.resolve(showModal(service.settingsModal, opts));
                },function(error){ dfd.reject(error); });

            return dfd.promise;
        }

        function showAddSection(event, sectionArea) {
            var opts = {
                controller: 'addSectionController',
                controllerAs: 'addSectionCtl',
                templateUrl: 'partials/modals/add_section_dialog.tmpl.html',
                parent: angular.element(document.body),
                locals: {area: sectionArea},
                targetEvent: event,
                fullscreen: service.customFullscreen
            };

            return showModal(service.addSectionModal, opts);
        }

        function showAddBlock(event, section, sectionArea) {
            var opts = {
                controller: 'addBlockController',
                controllerAs: 'addBlockCtl',
                templateUrl: 'partials/modals/add_block_dialog.tmpl.html',
                parent: angular.element(document.body),
                locals: {section: section, area: sectionArea},
                targetEvent: event,
                fullscreen: service.customFullscreen
            };

            return showModal(service.addBlockModal, opts);
        }

        function showAddLot(event, block, area) {
            var opts = {
                controller: 'addLotController',
                controllerAs: 'addLotCtl',
                templateUrl: 'partials/modals/add_lot_dialog.tmpl.html',
                parent: angular.element(document.body),
                locals: {block: block, area: area},
                targetEvent: event,
                fullscreen: service.customFullscreen
            };

            return showModal(service.addLotModal, opts);
        }

        function showLotDetail(lot) {
            var dfd = $q.defer();
            console.log('Show Lot Detail: ', lot);

            lot.get()
                .then(function (result) {
                    var opts = {
                        controller: 'lotDetailsController',
                        controllerAs: 'lotDetsCtl',
                        templateUrl: 'partials/modals/lot_details_dialog.tmpl.html',
                        parent: angular.element(document.body),
                        locals: {lot: result},
                        fullscreen: service.customFullscreen
                    };

                    dfd.resolve(showModal(service.showLotDetailModal, opts));
            },function(error){dfd.reject(error);});

            return dfd.promise;
        }

        function showClientSelection (lot) {
            var dfd = $q.defer();

            Clients.getList()
                .then(function (resp) {
                    var clients = [];
                    resp.forEach(function (cl) {
                        clients.push(cl);
                    });

                    var opts = {
                        controller: 'clientSelectionController',
                        controllerAs: 'clientSelectCtl',
                        templateUrl: 'partials/modals/lot_client_select_dialog.tmpl.html',
                        parent: angular.element(document.body),
                        locals: {lot: lot, clients: clients},
                        fullscreen: service.customFullscreen
                    };

                    dfd.resolve(showModal(service.showClientSelectionModal, opts));
            }, function (error) {
                dfd.reject(error);
            });

            return dfd.promise;
        }

        function showAddOccupant (lot) {
            var opts = {
                controller: 'addLotOccupantController',
                controllerAs: 'addLotOcptCtl',
                templateUrl: 'partials/modals/add_lot_occupant_dialog.tmpl.html',
                parent: angular.element(document.body),
                locals: {lot: lot},
                fullscreen: service.customFullscreen
            };

            return showModal(service.showAddOccupantModal, opts);
        }

        function showSalesReport () {
            var opts = {
                controller: 'salesReportController',
                controllerAs: 'salesRepCtl',
                templateUrl: 'partials/modals/sales_report_dialog.tmpl.html',
                parent: angular.element(document.body),
                fullscreen: service.customFullscreen
            };

            return showModal(service.salesReportModal, opts);
        }

        function showColumbaryList(event) {
            var opts = {
                controller: 'columbaryListController',
                controllerAs: 'cListCtl',
                templateUrl: 'partials/modals/columbary_list.tmpl.html',
                parent: angular.element(document.body),
                fullscreen: service.customFullscreen,
                targetEvent: event
            };

            return showModal(service.showColumbaryListModal, opts);
        }

        function showColumbaryDetail(columbary) {
            var dfd = $q.defer();

            columbary.get()
                .then(function (result) {
                    var opts = {
                        controller: 'columbaryDetailsController',
                        controllerAs: 'cDetsCtl',
                        templateUrl: 'partials/modals/columbary_details_dialog.tmpl.html',
                        parent: angular.element(document.body),
                        locals: {columbary: result},
                        fullscreen: service.customFullscreen
                    };

                    dfd.resolve(showModal(service.showColumbaryDetailModal, opts));
                }, function (error) {
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        function showColumbaryTable () {
            var opts = {
                controller: 'columbaryTableController',
                controllerAs: 'cTblCtl',
                templateUrl: 'partials/modals/columbary_table.tmpl.html',
                parent: angular.element(document.body),
                fullscreen: service.customFullscreen
            };

            return showModal(showColumbaryTableModal, opts);
        }

        function showCrematorium () {
            var opts = {
                controller: 'crematoriumListController',
                controllerAs: 'cremListCtl',
                templateUrl: 'partials/modals/crematorium_table.tmpl.html',
                parent: angular.element(document.body),
                fullscreen: service.customFullscreen
            };

            console.log('show crem modal');

            return showModal(showCrematoriumModal, opts);
        }

        function closeModal() {
            $mdDialog.cancel();
        }

        return service;
    }
}());