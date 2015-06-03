'use strict';

window.name = "NG_DEFER_BOOTSTRAP!";

require.config({
    waitSeconds: 120,
    baseUrl : '/app',
    paths: {
        'angular'         : 'libs/angular-flex/angular-flex',
        'ngRoute'         : 'libs/angular-route/angular-route',
        'async'           : 'libs/requirejs-plugins/src/async',
        'domReady'        : 'libs/requirejs-domready/domReady',
        'jquery'          : 'libs/jquery/jquery',
        'bootstrap'       : 'libs/bootstrap/bootstrap',
        'underscore'      : 'libs/underscore/underscore'
    },
    shim: {
        'libs/angular/angular'     : { deps: ['jquery'] },
        'angular'                  : { deps: ['libs/angular/angular'] },
        'ngRoute'                  : { deps: ['angular'] },
        'bootstrap'                : { deps: ['jquery' ] }
    }
});

require(['angular', 'domReady!', 'bootstrap', 'app', 'routes', 'template'], function (ng, doc) {


    ng.bootstrap(doc, ['app']);
    ng.resumeBootstrap();
});
