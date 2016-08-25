(function(){
'use strict';

angular.module('demoApp')
    .factory('dateUtils', [dateUtils]);

    function dateUtils () {
        var service = {};

        service.parseDateToISOString = parseDateToISOString;
        service.parseISOStrToDateObj = parseISOStrToDateObj;

        function parseDateToISOString (dateObj) {
            if(!dateObj || !dateObj instanceof Date) return false;
            return + dateObj.getFullYear() + '-'
                   + (dateObj.getMonth()+1) + '-'
                   + dateObj.getDate()
            ;
        }

        function parseISOStrToDateObj(dateISOStr) {
            if (!dateISOStr) return '';
            return new Date(dateISOStr.replace('T', ' '));
        }

        return service;
    }
}());