(function(){
    'use strict';

    var lotStatuses = [
        'vacant',
        'sold',
        'occupied'
    ];

    var lotColorByStatus = {
        vacant: '#2ecc71',
        sold: '#e74c3c',
        occupied: '#9b59b6'
    };

    var lotDimensions = [
        '3 X 3',
        '3 X 4.5',
        '1.5 X 3',
    ];

    angular.module('demoApp')
        .value('LOT_STATUSES', lotStatuses)
        .value('LOT_DIMENSIONS', lotDimensions)
        .value('LOT_COLORS', lotColorByStatus)
    ;

}());


