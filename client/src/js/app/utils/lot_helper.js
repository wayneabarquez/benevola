(function(){
'use strict';

angular.module('demoApp')
    .factory('lotHelper', [lotHelper]);

    function lotHelper () {
        var service = {};

        service.computeArea = computeArea;
        service.filterDimensionString = filterDimensionString;

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

        function filterDimensionArray (dimensionArray) {
            function removeNonNumeric(value) {
                return value.length && !isNaN(value);
            }
            return dimensionArray.filter(removeNonNumeric);
        }

        function filterDimensionString (dimension) {
            var dimensionArray = dimension.toLowerCase().split('x');
            return getDimensionString(filterDimensionArray(dimensionArray));
        }

        function getDimensionString(dimensionArray) {
            var dimension = '',
                len = dimensionArray.length;

            dimensionArray.forEach(function(value, index){
                if(index < len - 1) {
                    dimension += value + 'x';
                } else {
                    dimension += value;
                }
            });
            return dimension;
        }

        function computeArea (dimension) {
            if(!dimension) return false;

            var dimensionArray = dimension.toLowerCase().split('x');
            var filteredDimensionArray = filterDimensionArray(dimensionArray);

            if( !validateDimensionArray(dimensionArray)) return false;

            var dimensionStr = getDimensionString(filteredDimensionArray);

            var _area = filteredDimensionArray[0];
            for(var i=1; i < filteredDimensionArray.length; i++)
                _area *= filteredDimensionArray[i];

            dimensionStr += dimensionArray[dimensionArray.length - 1] == ""
                            ? 'x'
                            : '';

            return {
                dimension: dimensionStr,
                area: parseFloat(_area).toFixed(2)
            };
        }

        return service;
    }
}());