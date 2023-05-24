(function(window){ 'use strict';
var gitVersion = document.documentElement.attributes['git-version'].value;
var cdnHost = 'https://cdn.cbd.int/';

require.config({
    waitSeconds: 60,
    baseUrl : '/app',
    pluginPath: 'libs/curl/src/curl/plugin',
    paths: {
        'lodash':   cdnHost + 'lodash@3.10.1/index',
        'text':     cdnHost + 'requirejs-text@2.0.15/text',
        'urijs':    cdnHost + 'uri.js@0.1.3/src/uri',
    },
    urlArgs: gitVersion
});

if (!require.defined('angular')) {
    define('angular', [], function() {
        return window.angular;
    });
}

require(['angular', 'app', 'routes', 'template', 'authentication','factories/host-that-sends', 'providers/extended-route'], function (ng, app) {

    ng.element(document).ready(function () {
         ng.bootstrap(document, [app.name]);
    });
});

})(window);

// Fix IE Console
(function(a){a.console||(a.console={});for(var c="log info warn error debug trace dir group groupCollapsed groupEnd time timeEnd profile profileEnd dirxml assert count markTimeline timeStamp clear".split(" "),d=function(){},b=0;b<c.length;b++)a.console[c[b]]||(a.console[c[b]]=d)})(window); //jshint ignore:line
