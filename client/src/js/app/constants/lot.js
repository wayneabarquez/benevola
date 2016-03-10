(function(){
    'use strict';

    var lotStatuses = [
        'vacant',
        'sold',
        'occupied'
    ];

    var lotDimensions = [
        '3 X 3',
        '3 X 4.5',
        '1.5 X 3',
    ];

    angular.module('demoApp')
        .value('LOT_STATUSES', lotStatuses)
        .value('LOT_DIMENSIONS', lotDimensions)
    ;

}());


