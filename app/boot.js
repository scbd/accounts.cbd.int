(function(window){ 'use strict';

require.config({
    waitSeconds: 60,
    baseUrl : '/app',
    pluginPath: 'libs/curl/src/curl/plugin',
    paths: {
        'async'           : 'libs/requirejs-plugins/src/async',
        'lodash'          : 'libs/lodash/lodash.min',
        'text'            : 'libs/text/text',
        'urijs'           : 'libs/urijs/src',
        'socket.io'                 : 'libs/socket.io-1.4.5/index',
        'ionsound'                  : 'libs/ion-sound/js/ion.sound.min',
        'moment'                    : 'libs/moment/min/moment.min',
        'css'                       : 'libs/require-css/css.min',
    },
    packages: [
        { name: 'scbd-branding'          , location : 'libs/scbd-branding' },
        { name: 'scbd-angularjs-services', location : 'libs/scbd-angularjs-services/services' },
        { name: 'scbd-angularjs-filters',  location : 'libs/scbd-angularjs-services/filters' },
    ]
});

if (!require.defined('angular')) {
    define('angular', [], function() {
        return window.angular;
    });
}

if (!require.defined('_slaask'))
    define("_slaask", window._slaask);

require(['angular', 'app', 'routes', 'template', 'scbd-angularjs-services/authentication','factories/referrer', 'providers/extended-route'], function (ng, app) {

    ng.element(document).ready(function () {
         ng.bootstrap(document, [app.name]);
    });
});

})(window);

// Fix IE Console
(function(a){a.console||(a.console={});for(var c="log info warn error debug trace dir group groupCollapsed groupEnd time timeEnd profile profileEnd dirxml assert count markTimeline timeStamp clear".split(" "),d=function(){},b=0;b<c.length;b++)a.console[c[b]]||(a.console[c[b]]=d)})(window); //jshint ignore:line
