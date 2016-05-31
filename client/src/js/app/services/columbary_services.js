(function(){
'use strict';

angular.module('demoApp')
    .factory('columbaryServices', ['$q', 'Columbary', columbaryServices]);

    function columbaryServices ($q, Columbary) {
        var service = {};

        service.columbaryList = [];
        service.columbaryData = null;

        service.getDataWithParams = getDataWithParams;
        service.getData = getData;

        service.getAllData = getAllData;
        service.filterByBlock = filterByBlock;
        service.filterByStatus = filterByStatus;

        function getDataWithParams (params) {
            var dfd = $q.defer();

            Columbary.get('', params)
                .then(function (response) {
                    // reset columbary data
                    service.columbaryData = null;

                    if (response.columbary) service.columbaryData = angular.copy(response);
                    dfd.resolve(service.columbaryData);

                }, function (error) {
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        function getData (pageNo, block) {
            var params = {};

            params['page'] = pageNo || 1;
            if (block) params['block'] = block;

            return service.getDataWithParams(params);
        }

        function getAllData() {
            var dfd = $q.defer();

            Columbary.all('all').getList()
                .then(function(response){
                    // reset list
                    service.columbaryList = [];

                    response.forEach(function(item){
                        service.columbaryList.push(Columbary.cast(item));
                    });

                    dfd.resolve(service.columbaryList);

                }, function(error) {
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        function filterByBlock (_block) {
            return _.where(service.columbaryList, {block: _block || 'A'});
        }

        function filterByStatus (status, block) {
            return status
                    ? _.where(service.columbaryList, {status: status})
                    : filterByBlock(block);
        }

        return service;
    }
}());