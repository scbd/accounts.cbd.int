define(['app', 'angular'], function (app, angular) { 'use strict';

    app.provider("realm", {

        $get : [function() {
            return 'ACCOUNTS';
        }]
    });

}); //define
