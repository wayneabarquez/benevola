(function(){
'use strict';

angular.module('demoApp')
    .factory('lotHelper', [lotHelper]);

    function lotHelper () {
        var service = {};

        service.computeArea = computeArea;

        function isNumeric(num) {
            return !isNaN(num);
        }

        function validateDimensionArray(dimensionArray) {
            var flag = true,
                lastChar = dimensionArray[0];

            if(isNaN(lastChar)) return false;

            for(var i=1; i < dimensionArray.length; i++) {
                if(isNaN(lastChar) && isNaN(dimensionArray[i])) {
                    flag = false;
                    return;
                }

                lastChar = dimensionArray[i];
            }

            return flag;
        }

        function computerAreaByDimension(dimensionArray) {
            var product = 0;

            //dimensionArray.forEach(function(){
            //
            //});

        }

        function computeArea (dimension) {
            var dimensionArray = dimension.toLowerCase().split('x');

            //if (dimensionArray.length < 2) {
            //    alert('Invalid dimension value.');
            //    return false;
            //}

            console.log('dimensionArray: ', dimensionArray);

            if( !validateDimensionArray(dimensionArray)) {
                alert('Invalid dimension value.');
            }
        }

        return service;
    }
}());