(function(window){ 'use strict';

require.config({
    waitSeconds: 60,
    baseUrl : '/app',
    pluginPath: 'libs/curl/src/curl/plugin',
    paths: {
        'bootstrap'       : 'libs/bootstrap/dist/js/bootstrap.min',
        'jquery'          : 'libs/jquery/dist/jquery.min',
        'angular'         : 'libs/angular/angular.min',
        'ngRoute'         : 'libs/angular-route/angular-route.min',
        'ngCookies'       : 'libs/angular-cookies/angular-cookies.min',
        'async'           : 'libs/requirejs-plugins/src/async',
        'lodash'          : 'libs/lodash/lodash.min',
        'text'            : 'libs/text/text',
        'urijs'           : 'libs/urijs/src'
    },
    shim: {
        'angular'         : { deps : ['jquery'], exports : 'window.angular' },
        'ngRoute'         : { deps : ['angular'] },
        'ngCookies'       : { deps : ['angular'] },
        'bootstrap'       : { deps : ['jquery' ] }
    },
    urlArgs: document.cookie.replace(/(?:(?:^|.*;\s*)VERSION\s*\=\s*([^;]*).*$)|^.*$/, 'v=$1')
});

require(['angular', 'app', 'routes', 'template', 'authentication', 'factories/referrer', 'providers/extended-route'], function (ng, app) {

    ng.element(document.documentElement).ready(function () {

        ng.bootstrap(document.documentElement, [app.name]);

    });
});

})(window);

// Fix IE Console
(function(a){a.console||(a.console={});for(var c="log info warn error debug trace dir group groupCollapsed groupEnd time timeEnd profile profileEnd dirxml assert count markTimeline timeStamp clear".split(" "),d=function(){},b=0;b<c.length;b++)a.console[c[b]]||(a.console[c[b]]=d)})(window); //jshint ignore:line
